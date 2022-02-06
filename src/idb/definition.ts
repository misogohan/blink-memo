import { rawNote } from "./raw-note-mock";
import { importRawNote } from "./transaction-executer";
import { IDBErrorHandler, $ } from "./utils";

const INF = 2 ** 53;
const DB_ID = 'blink-memo';
const DB_VERSION = 1;
export const NOTE_STORE_NAME = 'note';
export const CHAPTER_STORE_NAME = 'chapter';
export const PAGE_STORE_NAME = 'page';
export const CURRICULUM_STORE_NAME = 'curriculum';

const upgradeHandler = (req: IDBOpenDBRequest) =>
  (ev: IDBVersionChangeEvent) => {
    const db = req.result;

    if (ev.oldVersion < 1) {
      const noteStore = db.createObjectStore(NOTE_STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      noteStore.createIndex('name', 'name', {
        unique: true,
        multiEntry: false,
      });
      noteStore.createIndex('chapters', 'chapters', {
        unique: true,
        multiEntry: true,
      });

      const chapterStore = db.createObjectStore(CHAPTER_STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      chapterStore.createIndex('note', 'noteId', {
        unique: false,
        multiEntry: false,
      });
      chapterStore.createIndex('pages', 'pages', {
        unique: true,
        multiEntry: true,
      });
      chapterStore.createIndex('note,name', ['noteId', 'name'], {
        unique: true,
        multiEntry: false,
      })

      const pageStore = db.createObjectStore(PAGE_STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      pageStore.createIndex('chapter', 'chapterId', {
        unique: false,
        multiEntry: false,
      });
      pageStore.createIndex('chapter,headline', ['chapterId', 'headline'], {
        unique: true,
        multiEntry: false,
      });

      const curriculumStore = db.createObjectStore(CURRICULUM_STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      curriculumStore.createIndex('note', 'noteId', {
        unique: false,
        multiEntry: false,
      });

      if(req.transaction != null) importRawNote(req.transaction)(() => {})(rawNote);
    }
  };

export const openDatabase = (resolve: (database: IDBDatabase) => void, reject?: IDBErrorHandler) => {
  const req = indexedDB.open(DB_ID, DB_VERSION);
  req.onupgradeneeded = upgradeHandler(req);
  $(req, resolve, reject);
};
