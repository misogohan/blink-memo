import { Book, BookID, Chapter, ChapterID, Curriculum, CurriculumID, OmitID, Page, PageID } from 'types/data-structure';

type IDBErrorHandler = (error: DOMException) => void;
const $ = <T>(req: IDBRequest<T>, onsuccess: (v: T) => void, onerror?: IDBErrorHandler) => {
  req.onsuccess = () => onsuccess(req.result);
  if (onerror != null) req.onerror = () => onerror(req.error!);
};
const $$ = (req: ReturnType<IDBObjectStore['openCursor']>, onfind: (cursor: IDBCursorWithValue) => void, doAfter?: (count: number) => void, onerror?: IDBErrorHandler) => {
  let count = 0;
  $(req, (v) => {
    if (v != null) {
      count++;
      onfind(v);
    } else if (doAfter != null) doAfter(count);
  }, onerror);
}

const INF = 2 ** 53;
const DB_ID = 'blink-memo';
const DB_VERSION = 1;
const BOOK_STORE_NAME = 'book';
const CHAPTER_STORE_NAME = 'chapter';
const PAGE_STORE_NAME = 'page';
const CURRICULUM_STORE_NAME = 'curriculum';

const upgradeHandler = (req: IDBOpenDBRequest) =>
  (ev: IDBVersionChangeEvent) => {
    const db = req.result;

    if (ev.oldVersion < 1) {
      const bookStore = db.createObjectStore(BOOK_STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      bookStore.createIndex('name', 'name', {
        unique: true,
        multiEntry: false,
      });
      bookStore.createIndex('chapters', 'chapters', {
        unique: true,
        multiEntry: true,
      });

      const chapterStore = db.createObjectStore(CHAPTER_STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      chapterStore.createIndex('book', 'bookID', {
        unique: false,
        multiEntry: false,
      });
      chapterStore.createIndex('pages', 'pages', {
        unique: true,
        multiEntry: true,
      });

      const pageStore = db.createObjectStore(PAGE_STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      pageStore.createIndex('chapter', 'chapterID', {
        unique: false,
        multiEntry: false,
      });
      pageStore.createIndex('chapter,headline', ['chapterID', 'headline'], {
        unique: true,
        multiEntry: false,
      });

      const curriculumStore = db.createObjectStore(CURRICULUM_STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      curriculumStore.createIndex('book', 'bookID', {
        unique: false,
        multiEntry: false,
      });
    }
  };

const database_promise = (() => {
  const req = indexedDB.open(DB_ID, DB_VERSION);
  req.onupgradeneeded = upgradeHandler(req);
  return new Promise<IDBDatabase>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
})();

const runTransaction = async <T = void>(
  storeNames: string | string[],
  mode: IDBTransactionMode,
  handler: (transaction: IDBTransaction, result: (v: T) => void) => void,
) => {
  const db = await database_promise;
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(storeNames, mode);
    let status: { returned: false } | { returned: true; value: T } = { returned: false };
    handler(t, (value) => {
      status = { value, returned: true };
    });
    t.oncomplete = () => {
      if (status.returned) resolve(status.value);
      else reject(new Error('Not returned'));
    };
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
};

export const getBook = (id: BookID) =>
  runTransaction<Book | undefined>(BOOK_STORE_NAME, 'readonly', (t, result) => {
    $(t.objectStore(BOOK_STORE_NAME).get(id), result);
  });
export const getBooks = () =>
  runTransaction<Book[]>(BOOK_STORE_NAME, 'readonly', (t, result) => {
    const books: Book[] = [];
    $$(t.objectStore(BOOK_STORE_NAME).openCursor(), (cursor) => {
      books.push(cursor.value);
      cursor.continue();
    }, () => result(books));
  });
export const addBook = ({ name }: Pick<Book, 'name'>) =>
  runTransaction<BookID>(BOOK_STORE_NAME, 'readwrite', (t, result) => {
    const data: OmitID<Book> = { name, chapters: [] };
    $(t.objectStore(BOOK_STORE_NAME).add(data) as any, result);
  });
export const delBook = (id: BookID) =>
  runTransaction([BOOK_STORE_NAME, CHAPTER_STORE_NAME, PAGE_STORE_NAME, CURRICULUM_STORE_NAME], 'readwrite', (t, result) => {
    const pageStore = t.objectStore(PAGE_STORE_NAME);

    $$(t.objectStore(CHAPTER_STORE_NAME).index('book').openCursor(id), (cursor) => {
      $$(pageStore.index('chapter').openCursor(cursor.value.id), (cursor) => {
        cursor.delete();
        cursor.continue();
      });
      cursor.delete();
      cursor.continue();
    });
    $$(t.objectStore(CURRICULUM_STORE_NAME).index('book').openCursor(id), (cursor) => {
      cursor.delete();
      cursor.continue();
    });
    t.objectStore(BOOK_STORE_NAME).delete(id);
    result();
  });
export const updateBook = (id: BookID, { name }: Pick<Book, 'name'>) =>
  runTransaction(BOOK_STORE_NAME, 'readwrite', (t, result) => {
    $$(t.objectStore(BOOK_STORE_NAME).openCursor(id), (cursor) => {
      cursor.update(Object.assign(cursor.value, { name }));
      cursor.continue();
    }, count => {
      if (count === 0) throw new Error('non-existent book id: ' + id);
      result();
    });
  });

export const getChapter = (id: ChapterID) =>
  runTransaction<Chapter | undefined>(CHAPTER_STORE_NAME, 'readonly', (t, result) => {
    $(t.objectStore(CHAPTER_STORE_NAME).get(id), result);
  });
export const getChapters = (id: BookID) =>
  runTransaction<Chapter[]>(CHAPTER_STORE_NAME, 'readonly', (t, result) => {
    const chapters: Chapter[] = [];
    $$(t.objectStore(CHAPTER_STORE_NAME).index('book').openCursor(id), (cursor) => {
      chapters.push(cursor.value);
      cursor.continue();
    }, () => result(chapters));
  });
type PositionSpecifier<T> = 'first' | 'last' | { prev: T };
export const addChapter = ({ bookID, name }: Pick<Chapter, 'bookID' | 'name'>, position: PositionSpecifier<ChapterID>) =>
  runTransaction<ChapterID>([BOOK_STORE_NAME, CHAPTER_STORE_NAME], 'readwrite', (t, result) => {
    const data: OmitID<Chapter> = {
      bookID,
      name,
      pages: [],
    };

    $<ChapterID>(t.objectStore(CHAPTER_STORE_NAME).add(data) as any, (chapterID) => {
      result(chapterID);

      $$(t.objectStore(BOOK_STORE_NAME).openCursor(bookID), (cursor) => {
        const newBook = Object.assign({}, cursor.value) as Book;
        const newChapters = position === 'first'
          ? [chapterID].concat(newBook.chapters)
          : position === 'last'
          ? newBook.chapters.concat(chapterID)
          : newBook.chapters.reduce<ChapterID[]>((p, c) => {
            p.push(c);
            if (c === position.prev) p.push(chapterID);
            return p;
          }, []);
        if (newChapters.length !== newBook.chapters.length + 1) throw TypeError('invalid position specifier: ' + position);
        newBook.chapters = newChapters;

        cursor.update(newBook);
        cursor.continue();
      }, count => {
        if (count === 0) throw new Error('non-existent book id: ' + bookID);
      });
    });
  });
export const delChapter = (id: ChapterID) =>
  runTransaction([CHAPTER_STORE_NAME, PAGE_STORE_NAME], 'readwrite', (t, result) => {
    $$(t.objectStore(PAGE_STORE_NAME).index('chapter').openCursor(id), (cursor) => {
      cursor.delete();
      cursor.continue();
    });
    t.objectStore(CHAPTER_STORE_NAME).delete(id);
    result();
  });
export const updateChapter = (id: ChapterID, { name }: Pick<Chapter, 'name'>) =>
  runTransaction(CHAPTER_STORE_NAME, 'readwrite', (t, result) => {
    $$(t.objectStore(CHAPTER_STORE_NAME).openCursor(id), (cursor) => {
      cursor.update(Object.assign(cursor.value, { name }));
      cursor.continue();
    }, count => {
      if (count === 0) throw new Error('non-existent chapter id: ' + id);
      result();
    });
  });
export const sortChapter = (id: ChapterID, position: PositionSpecifier<ChapterID>) =>
  runTransaction(BOOK_STORE_NAME, 'readwrite', (t, result) => {
    $$(t.objectStore(BOOK_STORE_NAME).index('chapters').openCursor(id), (cursor) => {
      const newBook = Object.assign({}, cursor.value) as Book;

      const newChapters: ChapterID[] = [];
      let f = false;
      if (position === 'first') newChapters.push(id);
      if ('string' === typeof position) {
        newBook.chapters.forEach((v) => {
          if (v !== id) newChapters.push(v);
        });
      } else {
        newBook.chapters.forEach((v) => {
          if (v !== id) newChapters.push(v);
          if (v === position.prev) {
            newChapters.push(id);
            f = true;
          }
        });
      }
      if (position === 'last') newChapters.push(id);
      if ('string' !== typeof position && !f) throw new TypeError('invalid prev chapter id: ' + position.prev);
      newBook.chapters = newChapters;

      cursor.update(newBook);
      cursor.continue();
    }, (count) => {
      if (count === 0) throw new TypeError('invalid chapter id: ' + id);
      result();
    });
  });
export const moveChapter = (id: ChapterID, to: BookID) =>
  runTransaction([BOOK_STORE_NAME, CHAPTER_STORE_NAME], 'readwrite', (t, result) => {
    const bookStore = t.objectStore(BOOK_STORE_NAME);

    $$(t.objectStore(CHAPTER_STORE_NAME).openCursor(id), (cursor) => {
      const from = cursor.value.bookID as BookID;
      const newChapter = Object.assign({}, cursor.value) as Chapter;

      if (to !== from) {
        newChapter.bookID = to;
        cursor.update(newChapter);

        $$(bookStore.openCursor(from), (cursor) => {
          const newBook = Object.assign({}, cursor.value) as Book;
          newBook.chapters = newBook.chapters.filter((v) => v !== id);
          cursor.update(newBook);
          cursor.continue();
        });
        $$(bookStore.openCursor(to), (cursor) => {
          const newBook = Object.assign({}, cursor.value) as Book;
          newBook.chapters.push(id);
          cursor.update(newBook);
          cursor.continue();
        }, (count) => {
          if (count === 0) throw new TypeError('non-existent destination book id: ' + to);
          result();
        });
      }
    }, (count) => {
      if (count === 0) throw new TypeError('non-existent chapter id: ' + id);
    });
  });

export const getPage = (id: PageID) =>
  runTransaction<Page | undefined>(PAGE_STORE_NAME, 'readonly', (t, result) => {
    $(t.objectStore(PAGE_STORE_NAME).get(id), result);
  });
export const getPages = (id: ChapterID) =>
  runTransaction<Page[]>(PAGE_STORE_NAME, 'readonly', (t, result) => {
    const pages: Page[] = [];
    $$(t.objectStore(PAGE_STORE_NAME).index('chapter').openCursor(id), (cursor) => {
      pages.push(cursor.value);
      cursor.continue();
    }, () => result(pages));
  });
export const addPage = ({ chapterID, headline, content, options }: OmitID<Page>, position: PositionSpecifier<PageID>) =>
  runTransaction<PageID>([CHAPTER_STORE_NAME, PAGE_STORE_NAME], 'readwrite', (t, result) => {
    const data: OmitID<Page> = {
      chapterID,
      headline,
      content,
      options,
    };

    $<PageID>(t.objectStore(PAGE_STORE_NAME).add(data) as any, (pageID) => {
      result(pageID);
      $$(t.objectStore(CHAPTER_STORE_NAME).openCursor(chapterID), (cursor) => {
        const newChapter = Object.assign({}, cursor.value) as Chapter;
        const newPages = position === 'first'
          ? [pageID].concat(newChapter.pages)
          : position === 'last'
          ? newChapter.pages.concat(pageID)
          : newChapter.pages.reduce<PageID[]>((p, c) => {
            p.push(c);
            if (c === position.prev) p.push(pageID);
            return p;
          }, []);
        if (newPages.length !== newChapter.pages.length + 1) throw new TypeError('invalid position specifier: ' + position);
        newChapter.pages = newPages;

        cursor.update(newChapter);
        cursor.continue();
      }, (count) => {
        if (count === 0) throw new TypeError('non-existent chapter id: ' + chapterID);
      });
    });
  });
export const delPage = (id: PageID) =>
  runTransaction(PAGE_STORE_NAME, 'readwrite', (t, result) => {
    t.objectStore(PAGE_STORE_NAME).delete(id);
    result();
  });
export const updatePage = (id: PageID, { headline, content, options }: Pick<Page, 'headline' | 'content' | 'options'>) =>
  runTransaction(PAGE_STORE_NAME, 'readwrite', (t, result) => {
    $$(t.objectStore(PAGE_STORE_NAME).openCursor(id), (cursor) => {
      cursor.update(Object.assign(cursor.value, { headline, content, options }));
      cursor.continue();
    }, (count) => {
      if (count === 0) throw new TypeError('non-existent page id: ' + id);
      result();
    });
  });
export const sortPage = (id: PageID, position: PositionSpecifier<PageID>) =>
  runTransaction(CHAPTER_STORE_NAME, 'readwrite', (t, result) => {
    $$(t.objectStore(CHAPTER_STORE_NAME).index('pages').openCursor(id), (cursor) => {
      const newChapter = Object.assign({}, cursor.value) as Chapter;

      const newPages: PageID[] = [];
      let f = false;
      if (position === 'first') newPages.push(id);
      if ('string' === typeof position) {
        newChapter.pages.forEach((v) => {
          if (v !== id) newPages.push(v);
        });
      } else {
        newChapter.pages.forEach((v) => {
          if (v !== id) newPages.push(v);
          if (v === position.prev) {
            newPages.push(id);
            f = true;
          }
        });
      }
      if (position === 'last') newPages.push(id);
      if ('string' !== typeof position && !f) throw new TypeError('invalid prev page id: ' + position.prev);
      newChapter.pages = newPages;

      cursor.update(newChapter);
      cursor.continue();
    }, (count) => {
      if (count === 0) throw new TypeError('invalid chapter id: ' + id);
      result();
    });
  });

export const movePage = (id: PageID, to: ChapterID) =>
  runTransaction([CHAPTER_STORE_NAME, PAGE_STORE_NAME], 'readwrite', (t, result) => {
    const chapterStore = t.objectStore(CHAPTER_STORE_NAME);

    $$(t.objectStore(PAGE_STORE_NAME).openCursor(id), (cursor) => {
      const newPage = Object.assign({}, cursor.value) as Page;
      const from = newPage.chapterID;

      if (to !== from) {
        newPage.chapterID = to;
        cursor.update(newPage);

        $$(chapterStore.openCursor(from), (cursor) => {
          const newChapter = Object.assign({}, cursor.value) as Chapter;
          newChapter.pages = newChapter.pages.filter((v) => v !== id);
          cursor.update(newChapter);
          cursor.continue();
        });
        $$(chapterStore.openCursor(to), (cursor) => {
          const newChapter = Object.assign({}, cursor.value) as Chapter;
          newChapter.pages.push(id);
          cursor.update(newChapter);
          cursor.continue();
        }, (count) => {
          if (count === 0) throw new TypeError('non-existent destination chapter id: ' + to);
          result();
        });
      }
    }, (count) => {
      if (count === 0) throw new TypeError('non-existent page id: ' + id);
    });
  });

export const getCurriculums = () =>
  runTransaction<Curriculum[]>(CURRICULUM_STORE_NAME, 'readonly', (t, result) => {
    const curriculums: Curriculum[] = [];
    $$(t.objectStore(CURRICULUM_STORE_NAME).openCursor(), (cursor) => {
      curriculums.push(cursor.value);
      cursor.continue();
    }, () => result(curriculums));
  });
export const getCurriculum = (id: CurriculumID) =>
  runTransaction<Curriculum | undefined>(CURRICULUM_STORE_NAME, 'readonly', (t, result) => {
    $(t.objectStore(CURRICULUM_STORE_NAME).get(id), result);
  });
export const addCurriculum = ({ name, mode, bookID }: Pick<Curriculum, 'name' | 'mode' | 'bookID'>) =>
  runTransaction<CurriculumID>(CURRICULUM_STORE_NAME, 'readwrite', (t, result) => {
    const data: OmitID<Curriculum> = { name, mode, bookID, lastAccess: undefined };
    $(t.objectStore(CURRICULUM_STORE_NAME).add(data) as any, result);
  });
export const delCurriculum = (id: CurriculumID) =>
  runTransaction(CURRICULUM_STORE_NAME, 'readwrite', (t, result) => {
    $$(t.objectStore(CURRICULUM_STORE_NAME).openCursor(id), (cursor) => {
      cursor.delete();
      cursor.continue();
    }, () => result());
  });
export const updateCurriculum = (id: CurriculumID, { name, bookID, mode, lastAccess }: Pick<Curriculum, 'name' | 'bookID' | 'mode' | 'lastAccess'>) =>
  runTransaction(CURRICULUM_STORE_NAME, 'readwrite', (t, result) => {
    $$(t.objectStore(CURRICULUM_STORE_NAME).openCursor(id), cursor => {
      cursor.update(Object.assign(cursor.value, { name, bookID, mode, lastAccess }));
      cursor.continue();
    }, count => {
      if (count === 0) throw new TypeError('non-existent curriculum id: ' + id);
      result();
    });
  });
export const copyCurriculum = (id: CurriculumID, name: string) =>
  runTransaction<CurriculumID>(CURRICULUM_STORE_NAME, 'readwrite', (t, result) => {
    const curriculumStore = t.objectStore(CURRICULUM_STORE_NAME);
    $<Curriculum | undefined>(curriculumStore.get(id), (curriculum) => {
      if (curriculum == null) throw new TypeError('non-existent curriculum id: '  + id);
      else {
        const newCurriculum: OmitID<Curriculum> = {
          name,
          mode: curriculum.mode,
          bookID: curriculum.bookID,
          lastAccess: undefined,
        };
        $<CurriculumID>(curriculumStore.add(newCurriculum) as any, result);
      }
    })
  })