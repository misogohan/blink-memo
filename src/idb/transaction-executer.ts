import { $, onlyPermutated } from './utils';
import { Chapter, ChapterId, Curriculum, CurriculumId, Note, NoteId, OmitId, Page, PageId, RawNote } from './data-structure';
import { CHAPTER_STORE_NAME, CURRICULUM_STORE_NAME, NOTE_STORE_NAME, openDatabase, PAGE_STORE_NAME, STORE_NAME } from './definition';

export type Executor<T> = Generator<IDBRequest<any> | Seek | (IDBRequest<any> | Seek)[], T, any>;
export const urge = <T>(executor: Executor<T>, resolve: (v: T) => void) => {
  const iterate = (v?: any) => {
    const {done, value} = executor.next(v);
    if (done) resolve(value);
    else {
      if (value instanceof IDBRequest) $(value, iterate);
      else if (value instanceof Seek) value.promise.then(iterate);
      else if (value instanceof Array) {
        const res = new Array(value.length);
        let count = 0;
        for (const [i, req] of value.entries()) {
          const f = (v: any) => {
            res[i] = v;
            count += 1;
            if (count == res.length) iterate(res);
          };
          if (req instanceof IDBRequest) $(req, f);
          else req.promise.then(f);
        }
      }
    }
  };
  iterate();
}
export type ExecutorCreator<T, Args extends readonly any[] > = (transaction: IDBTransaction, ...args: Args) => Executor<T>;
export const wrap = <Args extends readonly any[], T = void>(storeNames: STORE_NAME | STORE_NAME[], mode: IDBTransactionMode, creator: ExecutorCreator<T, Args>) => 
  (...args: Args) =>
    new Promise<T>((resolve, reject) => {
      openDatabase((db) => {
        const t = db.transaction(storeNames, mode);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);

        const executor = creator(t, ...args);
        urge(executor, resolve);
      }, reject);
    });
class Seek {
  readonly promise: Promise<void>;
  constructor(req: IDBRequest<IDBCursorWithValue | null>, callback: (cursor: IDBCursorWithValue) => Executor<void>) {
    this.promise = new Promise((resolve) => {
      req.addEventListener('success', () => {
        const cursor = req.result;
        if (cursor == null) resolve();
        else urge(callback(cursor), () => {});
      });
    });
  }
}

export const getNote: ExecutorCreator<Note, [id: NoteId]> = function* (transaction, id) {
  const v = yield transaction.objectStore(NOTE_STORE_NAME).get(id);
  if (v == null) throw new Error("invalid note id " + id);
  return structuredClone(v);
};
export const getNotes: ExecutorCreator<Note[], []> = function* (transaction) {
  const notes: Note[] = [];

  yield new Seek(transaction.objectStore(NOTE_STORE_NAME).openCursor(), function* (cursor) {
    notes.push(structuredClone(cursor.value));
    cursor.continue();
  });

  return notes;
};
export const addNote: ExecutorCreator<NoteId, [note: Pick<Note, 'name'>]> = function* (transaction, { name }) {
  const data: OmitId<Note> = { name, chapters: [], options: { textFlow: 'ltr' } };
  return yield transaction.objectStore(NOTE_STORE_NAME).add(data);
};
export const delNote: ExecutorCreator<void, [id: NoteId]> = function* (transaction, id) {
  const waitList = [transaction.objectStore(NOTE_STORE_NAME).delete(id)];

  const seekers = [
    new Seek(transaction.objectStore(CHAPTER_STORE_NAME).index('note').openCursor(id), function* (cursor) {
      seekers.push(
        new Seek(transaction.objectStore(PAGE_STORE_NAME).index('chapter').openCursor(cursor.value.id), function* (cursor) {
          waitList.push(cursor.delete());
          cursor.continue();
        }),
      );
      waitList.push(cursor.delete());
      cursor.continue();
    }),
    // new Seek(transaction.objectStore(CURRICULUM_STORE_NAME).index('note').openCursor(id), function* (cursor) {
    //   waitList.push(cursor.delete());
    //   cursor.continue();
    // }),
  ];

  yield seekers;
  yield waitList;
}
const updateNoteInternal: ExecutorCreator<void, [id: NoteId, f: (note: Note) => Partial<Omit<Note, 'noteId'>>]> = function* (transaction, id, f) { 
  const cursor: IDBCursorWithValue | null = yield transaction.objectStore(NOTE_STORE_NAME).openCursor(id); 
  if (cursor == null) throw new Error('non-existent note id: ' + id);
  else yield cursor.update({...cursor.value, ...f(cursor.value) });
};
export const updateNote: ExecutorCreator<void, [id: NoteId, note: Pick<Note, 'name' | 'options'>]> = function* (transaction, id, note) {
  yield* updateNoteInternal(transaction, id, () => note);
};

export const getChapter: ExecutorCreator<Chapter, [id: ChapterId]> = function* (transaction, id) {
  const v = yield transaction.objectStore(CHAPTER_STORE_NAME).get(id);
  if (v == null) throw new Error("invalid chapter id " + id);
  return structuredClone(v);
};
type PositionSpecifier<T> = 'first' | 'last' | { prev: T };
export const addChapter: ExecutorCreator<ChapterId, [chapter: Pick<Chapter, 'noteId' | 'name'>, position: PositionSpecifier<ChapterId>]> = function* (transaction, { noteId, name }, position) {
  const data: OmitId<Chapter> = {
    noteId,
    name,
    pages: [],
  };

  const chapterId: ChapterId = yield transaction.objectStore(CHAPTER_STORE_NAME).add(data);
  
  yield* updateNoteInternal(transaction, noteId, note => {
    const chapters = position === 'first' ? [chapterId].concat(note.chapters)
      : position === 'last' ? note.chapters.concat(chapterId)
      : note.chapters.reduce<ChapterId[]>((p, c) => {
        p.push(c);
        if (c === position.prev) p.push(chapterId);
        return p;
      }, []);
    if (chapters.length !== note.chapters.length + 1) throw TypeError('invalid position specifier: ' + position);
    return {chapters};
  });

  return chapterId;
}
export const delChapter: ExecutorCreator<void, [id: ChapterId]> = function* (transaction, id) {
  const waitList: IDBRequest<any>[] = [transaction.objectStore(CHAPTER_STORE_NAME).delete(id)];
  yield [
    new Seek(transaction.objectStore(NOTE_STORE_NAME).index('chapters').openCursor(id), function* (cursor) {
      const note = cursor.value as Note;
      waitList.push(cursor.update({ ...note, chapters: note.chapters.filter(cid => cid !== id) }));
      cursor.continue();
    }),
    new Seek(transaction.objectStore(PAGE_STORE_NAME).index('chapter').openCursor(id), function* (cursor) {
      waitList.push(cursor.delete());
      cursor.continue();
    }),
  ];
  yield waitList;
};
const updateChapterInternal: ExecutorCreator<void, [id: ChapterId, f: (chapter: Chapter) => Partial<Omit<Chapter, 'chapterId'>>]> = function* (transaction, id, f) {
  const cursor: IDBCursorWithValue | null = yield transaction.objectStore(CHAPTER_STORE_NAME).openCursor(id);
  if (cursor == null) throw new Error('non-existent chapter id: ' + id);
  else yield cursor.update({ ...cursor.value, ...f(cursor.value) });
}
export const updateChapter: ExecutorCreator<void, [id: ChapterId, chapter: Pick<Chapter, 'name'>]> = function* (transaction, id, chapter) {
  yield* updateChapterInternal(transaction, id, () => chapter);
};
export const sortChapter: ExecutorCreator<void, [id: NoteId, order: ChapterId[]]> = function* (transaction, id, chapterOrder) {
  yield* updateNoteInternal(transaction, id, ({ chapters }) => {
    if (!onlyPermutated(chapters, chapterOrder)) throw new TypeError('invalid chapter order: ' + chapterOrder + '. The original one: ' + chapters);
    return { chapters: chapterOrder };
  });
};
export const moveChapter: ExecutorCreator<void, [id: ChapterId, noteId: NoteId]> = function* (transaction, id, to) {
  const cursor: IDBCursorWithValue | null = yield transaction.objectStore(CHAPTER_STORE_NAME).openCursor(id);
  if (cursor == null) throw new TypeError('non-existent chapter id: ' + id);

  const chapter = cursor.value as Chapter;
  const from = chapter.noteId;

  if (to !== from) {
    yield cursor.update({...chapter, noteId: to });

    yield* updateNoteInternal(transaction, from, note => ({ chapters: note.chapters.filter(v => v !== id) }));
    yield* updateNoteInternal(transaction, to, note => ({ chapters: note.chapters.concat(id) }));
  }
};

export const getPage: ExecutorCreator<Page | undefined, [id: PageId]> = function* (transaction, id) {
  const v = yield transaction.objectStore(PAGE_STORE_NAME).get(id);
  return structuredClone(v);
};
export const addPage: ExecutorCreator<PageId, [page: OmitId<Page>, position: PositionSpecifier<PageId>]> = function* (transaction, { chapterId, headline, content }, position) {
  const data: OmitId<Page> = {
    chapterId,
    headline,
    content,
  };

  const pageId = yield transaction.objectStore(PAGE_STORE_NAME).add(data);
  yield* updateChapterInternal(transaction, chapterId, chapter => {
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

    return {pages};
  });

  return pageId;
};
export const delPage: ExecutorCreator<void, [id: PageId]> = function* (transaction, id) {
  const waitList: IDBRequest<any>[] = [transaction.objectStore(PAGE_STORE_NAME).delete(id)];
  yield new Seek(transaction.objectStore(CHAPTER_STORE_NAME).index("pages").openCursor(id), function* (cursor) {
    const chapter = cursor.value as Chapter;
    waitList.push(cursor.update({ ...chapter, pages: chapter.pages.filter(v => v !== id) }));
    cursor.continue();
  });
  yield waitList;
};
export const updatePage: ExecutorCreator<void, [id: PageId, page: Pick<Page, 'headline' | 'content'>]> = function* (transaction, id, { headline, content }) {
  const cursor: IDBCursorWithValue | null = yield transaction.objectStore(PAGE_STORE_NAME).openCursor(id);
  if (cursor == null) throw new TypeError('non-existent page id: ' + id);
  else yield cursor.update({ ...cursor.value, headline, content });
};
export const sortPage: ExecutorCreator<void, [id: ChapterId, order: PageId[]]> = function* (transaction, id, pageOrder) {
  yield* updateChapterInternal(transaction, id, chapter => {
      if(!onlyPermutated(chapter.pages, pageOrder)) throw new TypeError(`invalid page order: ${ pageOrder }. The original one: ${ chapter.pages }.`);
      return { pages: pageOrder };
  });
};

export const movePage: ExecutorCreator<void, [id: PageId, chapterId: ChapterId]> = function* (transaction, id, to) {
  const cursor: IDBCursorWithValue | null = yield transaction.objectStore(PAGE_STORE_NAME).openCursor(id);
  if (cursor == null) throw new TypeError('non-existent page id: ' + id);

  const page = cursor.value as Page;
  const from = page.chapterId;

  if (to !== from) {
    yield cursor.update({ ...page, chapterId: to });

    yield* updateChapterInternal(transaction, from, chapter => ({ pages: chapter.pages.filter(pid => pid !== id) }));
    yield* updateChapterInternal(transaction, to, chapter => ({ pages: chapter.pages.concat(id) }));
  }
};

export const getCurriculums: ExecutorCreator<Curriculum[], []> = function* (transaction) {
  const curriculums: Curriculum[] = [];

  yield new Seek(transaction.objectStore(CURRICULUM_STORE_NAME).openCursor(), function *(cursor)  {
    curriculums.push(structuredClone(cursor.value));
    cursor.continue();
  });

  return curriculums;
};
export const getCurriculum: ExecutorCreator<Curriculum | undefined, [id: CurriculumId]> = function* (transaction, id ) {
  const v = yield transaction.objectStore(CURRICULUM_STORE_NAME).get(id);
  return structuredClone(v);
};
export const addCurriculum: ExecutorCreator<CurriculumId, [curriculum: Pick<Curriculum, 'name' | 'mode' | 'noteId'>]> = function*(transaction, { name, mode, noteId }) {
  const data: OmitId<Curriculum> = { name, mode, noteId, lastAccess: undefined };

  const count: number = yield transaction.objectStore(NOTE_STORE_NAME).count(noteId);
  if (count == 0) throw new Error('non-existent note id: ' + noteId);

  return yield transaction.objectStore(CURRICULUM_STORE_NAME).add(data);
};
export const delCurriculum: ExecutorCreator<void, [id: CurriculumId]> = function* (transaction, id: CurriculumId) {
  yield transaction.objectStore(CURRICULUM_STORE_NAME).delete(id);
};
export const updateCurriculum: ExecutorCreator<void, [id: CurriculumId, curriculum: Omit<Curriculum, 'id'>]> = function* (transaction, id, { name, noteId, mode, lastAccess })  {
  const cursor: IDBCursorWithValue | null = yield transaction.objectStore(CURRICULUM_STORE_NAME).openCursor(id);
  if (cursor == null) throw new TypeError('non-existent curriculum id: ' + id);
  const curriculum = cursor.value as Curriculum;
  cursor.update({ ...curriculum,  name, noteId, mode, lastAccess });
};

export const importRawNote: ExecutorCreator<void, [rawNote: RawNote]> = function* (transaction, {name, chapters, options}) {
  const noteStore = transaction.objectStore(NOTE_STORE_NAME);
  const chapterStore = transaction.objectStore(CHAPTER_STORE_NAME);
  const pageStore = transaction.objectStore(PAGE_STORE_NAME);

  const note: OmitId<Note> = {
    name,
    chapters: [],
    options,
  };

  const noteId = yield* addNote(transaction, { name });
  for (const { name, pages } of chapters) {
    const chapter: OmitId<Chapter> = {
      name,
      noteId,
      pages: [],
    };
    const chapterId: ChapterId = yield chapterStore.add(chapter);
    note.chapters.push(chapterId);

    for (const { headline, content } of pages) {
      const page: OmitId<Page> = {
        chapterId,
        headline,
        content,
      };
      const pageId = yield pageStore.add(page);
      chapter.pages.push(pageId);
    }
    yield chapterStore.put({ id: chapterId, ...chapter });
  }
  yield noteStore.put({id:noteId, ...note });
}
