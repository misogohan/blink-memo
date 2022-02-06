import { $, $$, onlyPermutated } from './utils';
import { Chapter, ChapterId, Curriculum, CurriculumId, Note, NoteId, OmitId, Page, PageId, RawNote } from './data-structure';
import { CHAPTER_STORE_NAME, CURRICULUM_STORE_NAME, NOTE_STORE_NAME, openDatabase, PAGE_STORE_NAME } from './definition';

class WaitAllRequest {
  private count = 0;

  constructor(private resolve: () => void) {}

  /**
   * call after you add your own event handle on the request
   */
  push(request: IDBRequest) {
    this.count++;
    $(request, () => {
      this.count--;
      if (this.count === 0) this.resolve();
    })
  }

  check() {
    if (this.count === 0) this.resolve();
  }
}

export const getTransactionExecution = <Args extends readonly any[], T = void>(storeNames: string | string[], mode: IDBTransactionMode, executer: TransactionExecuter<T, Args>) =>
  (...args: Args) =>
    new Promise<T>((resolve, reject) => {
      openDatabase((db) => {
        type Status = { returned: false } | { returned: true; value: T } 

        const t = db.transaction(storeNames, mode);

        let status: Status = { returned: false };
        executer(t)((value) => {
          status = { value, returned: true };
        })(...args);

        t.oncomplete = () => {
          if (status.returned) resolve(status.value);
          else reject(new Error('Not returned'));
        };
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      }, reject);
    });
  
type TransactionExecuter<T, Args extends readonly any[]> = (transaction: IDBTransaction) => (resolve: (v: T) => void) => (...args: Args) => void;

export const getNote: TransactionExecuter<Note | undefined, [NoteId]> = transaction => resolve =>
  (id: NoteId) => {
    $(transaction.objectStore(NOTE_STORE_NAME).get(id), v => resolve(structuredClone(v)));
  };
export const getNotes: TransactionExecuter<Note[], []> = transaction => resolve =>
  () => {
    const notes: Note[] = [];
    $$(transaction.objectStore(NOTE_STORE_NAME).openCursor(), (cursor) => {
      notes.push(structuredClone(cursor.value));
      cursor.continue();
    }, () => resolve(notes));
  };
export const addNote: TransactionExecuter<NoteId, [Pick<Note, 'name'>]> = transaction => resolve =>
  ({ name }) => {
    const data: OmitId<Note> = { name, chapters: [] };
    $(transaction.objectStore(NOTE_STORE_NAME).add(data) as any, resolve);
  };
export const delNote: TransactionExecuter<void, [NoteId]> = transaction => resolve =>
  (id: NoteId) => {
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);
    const waiter = new WaitAllRequest(resolve);

    $$(transaction.objectStore(CHAPTER_STORE_NAME).index('note').openCursor(id), (cursor) => {
      $$(pageStore.index('chapter').openCursor(cursor.value.id), (cursor) => {
        waiter.push(cursor.delete());
        cursor.continue();
      });
      waiter.push(cursor.delete());
      cursor.continue();
    });
    $$(transaction.objectStore(CURRICULUM_STORE_NAME).index('note').openCursor(id), (cursor) => {
      waiter.push(cursor.delete());
      cursor.continue();
    });
    waiter.push(transaction.objectStore(NOTE_STORE_NAME).delete(id));
  };

export const updateNote: TransactionExecuter<void, [NoteId, Pick<Note, 'name'>]> = transaction => resolve =>
  (id, { name }) => {
    const waiter = new WaitAllRequest(resolve);

    $$(transaction.objectStore(NOTE_STORE_NAME).openCursor(id), (cursor) => {
      waiter.push(cursor.update({ ...cursor.value, name }));
      cursor.continue();
    }, (count) => {
      if (count === 0) throw new Error('non-existent note id: ' + id);
    });
  };

export const getChapter: TransactionExecuter<Chapter | undefined, [ChapterId]> = transaction => resolve =>
  (id: ChapterId) => {
    $(transaction.objectStore(CHAPTER_STORE_NAME).get(id), v => resolve(structuredClone(v)));
  };
export const getChapters: TransactionExecuter<Chapter[], [NoteId]> = transaction => resolve =>
  (id: NoteId) => {
    const chapters: Chapter[] = [];
    $$(transaction.objectStore(CHAPTER_STORE_NAME).index('note').openCursor(id), (cursor) => {
      chapters.push(structuredClone(cursor.value));
      cursor.continue();
    }, () => resolve(chapters));
  };
type PositionSpecifier<T> = 'first' | 'last' | { prev: T };
export const addChapter: TransactionExecuter<ChapterId, [Pick<Chapter, 'noteId' | 'name'>, PositionSpecifier<ChapterId>]> = transaction => resolve =>
  ({ noteId, name }, position) => {
    const data: OmitId<Chapter> = {
      noteId,
      name,
      pages: [],
    };

    $<ChapterId>(transaction.objectStore(CHAPTER_STORE_NAME).add(data) as any, (chapterId) => {
      const waiter = new WaitAllRequest(() => resolve(chapterId));

      $$(transaction.objectStore(NOTE_STORE_NAME).openCursor(noteId), (cursor) => {
        const note = cursor.value as Note;
        const chapters = position === 'first'
          ? [chapterId].concat(note.chapters)
          : position === 'last'
          ? note.chapters.concat(chapterId)
          : note.chapters.reduce<ChapterId[]>((p, c) => {
            p.push(c);
            if (c === position.prev) p.push(chapterId);
            return p;
          }, []);
        if (chapters.length !== note.chapters.length + 1) throw TypeError('invalid position specifier: ' + position);

        waiter.push(cursor.update({ ...note, chapters }));
        cursor.continue();
      }, (count) => {
        if (count === 0) throw new Error('non-existent note id: ' + noteId);
      });
    });
  };
export const delChapter: TransactionExecuter<void, [ChapterId]> = transaction => resolve =>
  (id: ChapterId) => {
    const waiter = new WaitAllRequest(resolve);

    $$(transaction.objectStore(NOTE_STORE_NAME).index('chapters').openCursor(id), cursor => {
      const note = cursor.value as Note;
      waiter.push(cursor.update({ ...note, chapters: note.chapters.filter(cid => cid !== id) }));
      cursor.continue();
    });
    $$(transaction.objectStore(PAGE_STORE_NAME).index('chapter').openCursor(id), (cursor) => {
      waiter.push(cursor.delete());
      cursor.continue();
    });
    waiter.push(transaction.objectStore(CHAPTER_STORE_NAME).delete(id));
  };
export const updateChapter: TransactionExecuter<void, [ChapterId, Pick<Chapter, 'name'>]> = transaction => resolve =>
  (id, { name }) => {
    const waiter = new WaitAllRequest(resolve);

    $$(transaction.objectStore(CHAPTER_STORE_NAME).openCursor(id), (cursor) => {
        waiter.push(cursor.update({ ...cursor.value, name }));
        cursor.continue();
    }, (count) => {
      if (count === 0) throw new Error('non-existent chapter id: ' + id);
    });
  };
export const sortChapter: TransactionExecuter<void, [NoteId, ChapterId[]]> = transaction => resolve =>
  (id, chapterOrder) => {
    const waiter = new WaitAllRequest(resolve);
    $$(transaction.objectStore(NOTE_STORE_NAME).openCursor(id), (cursor) => {
      const note = cursor.value as Note;
      if (!onlyPermutated(note.chapters, chapterOrder)) throw new TypeError('invalid chapter order: ' + chapterOrder + '. The original one: ' + note.chapters);

      waiter.push(cursor.update({ ...note, chapters: chapterOrder }));
      cursor.continue();
    }, (count) => {
      if (count === 0) throw new TypeError('invalid chapter id: ' + id);
    });
  };
export const moveChapter: TransactionExecuter<void, [ChapterId, NoteId]> = transaction => resolve =>
  (id: ChapterId, to: NoteId) => {
    const waiter = new WaitAllRequest(resolve);
    const noteStore = transaction.objectStore(NOTE_STORE_NAME);

    $$(transaction.objectStore(CHAPTER_STORE_NAME).openCursor(id), (cursor) => {
      const newChapter = structuredClone<Chapter>(cursor.value);
      const from = newChapter.noteId as NoteId;

      if (to !== from) {
        newChapter.noteId = to;
        waiter.push(cursor.update(newChapter));

        $$(noteStore.openCursor(from), (cursor) => {
          const newNote = structuredClone<Note>(cursor.value);
          newNote.chapters = newNote.chapters.filter((v) => v !== id);
          waiter.push(cursor.update(newNote));
          cursor.continue();
        });
        $$(noteStore.openCursor(to), (cursor) => {
          const newNote = structuredClone<Note>(cursor.value);
          newNote.chapters.push(id);
          waiter.push(cursor.update(newNote));
          cursor.continue();
        }, (count) => {
          if (count === 0) throw new TypeError('non-existent destination note id: ' + to);
        });
      }
      cursor.continue();
    }, (count) => {
      if (count === 0) throw new TypeError('non-existent chapter id: ' + id);
    });
  };

export const getPage: TransactionExecuter<Page | undefined, [PageId]> = transaction => resolve =>
  (id: PageId) => {
    $(transaction.objectStore(PAGE_STORE_NAME).get(id), v => resolve(structuredClone(v)));
  };
export const getPages: TransactionExecuter<Page[], [ChapterId]> = transaction => resolve =>
  (id: ChapterId) => {
    const pages: Page[] = [];
    $$(transaction.objectStore(PAGE_STORE_NAME).index('chapter').openCursor(id), (cursor) => {
      pages.push(structuredClone(cursor.value));
      cursor.continue();
    }, () => resolve(pages));
  };
export const addPage: TransactionExecuter<PageId, [OmitId<Page>, PositionSpecifier<PageId>]> = transaction => resolve =>
  ({ chapterId, headline, content, options }, position) => {
    const data: OmitId<Page> = {
      chapterId,
      headline,
      content,
      options,
    };

    $<PageId>(transaction.objectStore(PAGE_STORE_NAME).add(data) as any, (pageId) => {
      const waiter = new WaitAllRequest(() => resolve(pageId));
      $$(transaction.objectStore(CHAPTER_STORE_NAME).openCursor(chapterId), (cursor) => {
        const chapter = cursor.value as Chapter;
        const pages = position === 'first'
          ? [pageId].concat(chapter.pages)
          : position === 'last'
          ? chapter.pages.concat(pageId)
          : chapter.pages.reduce<PageId[]>((p, c) => {
            p.push(c);
            if (c === position.prev) p.push(pageId);
            return p;
          }, []);
        if (pages.length !== chapter.pages.length + 1) throw new TypeError('invalid position specifier: ' + position);

        waiter.push(cursor.update({ ...chapter, pages }));
        cursor.continue();
      }, (count) => {
        if (count === 0) throw new TypeError('non-existent chapter id: ' + chapterId);
      });
    });
  };
export const delPage: TransactionExecuter<void, [PageId]> = transaction => resolve =>
  (id: PageId) => {
    $(transaction.objectStore(PAGE_STORE_NAME).delete(id), resolve);
  };
export const updatePage: TransactionExecuter<void, [PageId, Pick<Page, 'headline' | 'content' | 'options'>]> = transaction => resolve =>
  (id, { headline, content, options }) => {
    const waiter = new WaitAllRequest(resolve)
    $$(transaction.objectStore(PAGE_STORE_NAME).openCursor(id), (cursor) => {
      const page = cursor.value as Page;

      waiter.push(cursor.update({ ...page, headline, content, options }));
      cursor.continue();
    }, (count) => {
      if (count === 0) throw new TypeError('non-existent page id: ' + id);
    });
  };
export const sortPage: TransactionExecuter<void, [ChapterId, PageId[]]> = transaction => resolve =>
  (id, pageOrder) => {
    const waiter = new WaitAllRequest(resolve);
    $$(transaction.objectStore(CHAPTER_STORE_NAME).openCursor(id), (cursor) => {
      const chapter = cursor.value as Chapter;
      if(!onlyPermutated(chapter.pages, pageOrder)) throw new TypeError(`invalid page order: ${ pageOrder }. The original one: ${ chapter.pages }.`);

      waiter.push(cursor.update({ ...chapter, pages: pageOrder }));
      cursor.continue();
    }, (count) => {
      if (count === 0) throw new TypeError('invalid chapter id: ' + id);
    });
  };

export const movePage: TransactionExecuter<void, [PageId, ChapterId]> = transaction => resolve =>
  (id: PageId, to: ChapterId) => {
    const waiter = new WaitAllRequest(resolve)
    const chapterStore = transaction.objectStore(CHAPTER_STORE_NAME);

    $$(transaction.objectStore(PAGE_STORE_NAME).openCursor(id), (cursor) => {
      const page = cursor.value as Page;
      const from = page.chapterId;

      if (to !== from) {
        waiter.push(cursor.update({ ...page, chapterId: to }));
        $$(chapterStore.openCursor(from), (cursor) => {
          const chapter = cursor.value as Chapter;
          waiter.push(cursor.update({ ...chapter, pages: chapter.pages.filter(pid => pid !== id) }));
          cursor.continue();
        }, count => {
          if (count !== 1) throw new Error('the chapter of page does not exist correctly');
        });
        $$(chapterStore.openCursor(to), (cursor) => {
          const chapter = cursor.value as Chapter;
          waiter.push(cursor.update({ ...chapter, pages: chapter.pages.concat(id) }));
          cursor.continue();
        }, (count) => {
          if (count === 0) throw new TypeError('non-existent destination chapter id: ' + to);
        });
      }
      cursor.continue();
    }, (count) => {
      if (count === 0) throw new TypeError('non-existent page id: ' + id);
    });
  };

export const getCurriculums: TransactionExecuter<Curriculum[], []> = transaction => resolve =>
  () => {
    const curriculums: Curriculum[] = [];
    $$(transaction.objectStore(CURRICULUM_STORE_NAME).openCursor(), (cursor) => {
      curriculums.push(structuredClone(cursor.value));
      cursor.continue();
    }, () => resolve(curriculums));
  };
export const getCurriculum: TransactionExecuter<Curriculum | undefined, [CurriculumId]> = transaction => resolve =>
  (id: CurriculumId) => {
    $(transaction.objectStore(CURRICULUM_STORE_NAME).get(id), v => resolve(structuredClone(v)));
  };
export const addCurriculum: TransactionExecuter<CurriculumId, [Pick<Curriculum, 'name' | 'mode' | 'noteId'>]> = transaction => resolve =>
  ({ name, mode, noteId }) => {
    const data: OmitId<Curriculum> = { name, mode, noteId, lastAccess: undefined };
    $(transaction.objectStore(CURRICULUM_STORE_NAME).add(data) as any, resolve);
  };
export const delCurriculum: TransactionExecuter<void, [CurriculumId]> = transaction => resolve =>
  (id: CurriculumId) => {
    $(transaction.objectStore(CURRICULUM_STORE_NAME).delete(id), resolve);
  };
export const updateCurriculum: TransactionExecuter<void, [CurriculumId, Pick<Curriculum, 'name' | 'noteId' | 'mode' | 'lastAccess'>]> = transaction => resolve =>
  (id, { name, noteId, mode, lastAccess }) => {
    const waiter = new WaitAllRequest(resolve);
    $$(transaction.objectStore(CURRICULUM_STORE_NAME).openCursor(id), (cursor) => {
      const curriculum = cursor.value as Curriculum;
      waiter.push(cursor.update({ ...curriculum,  name, noteId, mode, lastAccess }));
      cursor.continue();
    }, (count) => {
      if (count === 0) throw new TypeError('non-existent curriculum id: ' + id);
    });
  };
export const copyCurriculum: TransactionExecuter<CurriculumId, [CurriculumId, string]> = transaction => resolve =>
  (id, name) => {
    const curriculumStore = transaction.objectStore(CURRICULUM_STORE_NAME);
    $<Curriculum | undefined>(curriculumStore.get(id), (curriculum) => {
      if (curriculum == null) throw new TypeError('non-existent curriculum id: ' + id);
      else {
        const newCurriculum: OmitId<Curriculum> = {
          name,
          mode: curriculum.mode,
          noteId: curriculum.noteId,
          lastAccess: undefined,
        };
        $<CurriculumId>(curriculumStore.add(newCurriculum) as any, resolve);
      }
    });
  };

export const importRawNote: TransactionExecuter<void, [RawNote]> = transaction => resolve =>
  ({ name, chapters }) => {
    const noteStore = transaction.objectStore(NOTE_STORE_NAME);
    const chapterStore = transaction.objectStore(CHAPTER_STORE_NAME);
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);
    const waiter = new WaitAllRequest(resolve);

    const note: OmitId<Note> = {
      name,
      chapters: [],
    };

    waiter.push($<NoteId>(noteStore.add(note) as any, noteId => {
      chapters.forEach(({ name, pages }, i) => {
        const chapter: OmitId<Chapter> = {
          name,
          noteId,
          pages: [],
        };
        waiter.push($<ChapterId>(chapterStore.add(chapter) as any, chapterId => {
          note.chapters.push(chapterId);
          if (i === chapters.length - 1) waiter.push(noteStore.put({ id: noteId, ...note }));

          pages.forEach(({ headline, content, options }, j) => {
            const page: OmitId<Page> = {
              chapterId,
              headline,
              content,
              options,
            };
            waiter.push($<PageId>(pageStore.add(page) as any, pageId => {
              chapter.pages.push(pageId); // the order will be preserved
              if (j === pages.length - 1) waiter.push(chapterStore.put({ id: chapterId, ...chapter }));
            }));
          });
        }));
      });
    }));
  }
