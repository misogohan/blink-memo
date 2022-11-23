import * as te from './transaction-executer';
import { ChapterId, Note, NoteId, PageId} from "./data-structure";
import {CHAPTER_STORE_NAME, NOTE_STORE_NAME, PAGE_STORE_NAME} from './definition';

export const getNote = te.wrap(NOTE_STORE_NAME, 'readonly', te.getNote);
export const getNoteList = te.wrap(NOTE_STORE_NAME, 'readonly', te.getNotes);
export const updateNote = te.wrap(NOTE_STORE_NAME, 'readwrite', te.updateNote);

export type NoteInfo = { id: NoteId, name: string, options: Note['options'], chapters: ChapterInfo[] };
export type ChapterInfo = { id: ChapterId, name: string, pages: PageInfo[] };
export type PageInfo = { id: PageId, headline: string };
export const getNoteInfo = te.wrap<[id: ChapterId], NoteInfo>([NOTE_STORE_NAME, CHAPTER_STORE_NAME, PAGE_STORE_NAME], 'readonly', function *(t, id) {
  const note = yield* te.getNote(t, id);
  if (note == null) throw Error("non existent note");
  const noteInfo: NoteInfo = { id: note.id, name: note.name, options: note.options, chapters: new Array(note.chapters.length) };
  const chapters = yield* te.getChapters(t, note.id);
  for (const chapter of chapters) {
    const chapterInfo: ChapterInfo = { id: chapter.id, name: chapter.name, pages: new Array(chapter.pages.length) };
    const pages = yield* te.getPages(t, chapter.id);
    for (const page of pages) {
      chapterInfo.pages[chapter.pages.findIndex(id => id === page.id)] = { id: page.id, headline: page.headline };
    }
    noteInfo.chapters[note.chapters.findIndex(id => id === chapter.id)] = chapterInfo;
  }
  return noteInfo;
});

export const getChapter = te.wrap(CHAPTER_STORE_NAME, 'readonly', te.getChapter);

export const getPage = te.wrap(PAGE_STORE_NAME, 'readonly', te.getPage);
export const updatePage = te.wrap(PAGE_STORE_NAME, 'readwrite', te.updatePage);
