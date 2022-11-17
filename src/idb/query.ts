import * as te from './transaction-executer';
import {Chapter, ChapterId, Note} from "./data-structure";
import {CHAPTER_STORE_NAME, NOTE_STORE_NAME} from './definition';

export const getNote = te.wrap(NOTE_STORE_NAME, 'readonly', te.getNote);
export const getNoteList = te.wrap(NOTE_STORE_NAME, 'readonly', te.getNotes);
export const getNoteInfo = te.wrap<[id: ChapterId], { note: Note, chapters: Pick<Chapter, 'id' | 'name'>[] }>([NOTE_STORE_NAME, CHAPTER_STORE_NAME], 'readonly', function *(t, id) {
  const note = yield* te.getNote(t, id);
  if (note == null) throw Error("non existent note");
  const chapters: Pick<Chapter, 'id' | 'name'>[] = new Array(note.chapters.length);
  for (const [i, chapter] of note.chapters.entries()) {
    const ch = yield* te.getChapter(t, chapter);
    if (ch == null) throw Error(`A chapter whose id is ${id} does not exist. The DB record seems to have been broken.`);
    chapters[i] = { id: ch.id, name: ch.name };
  }
  return { note, chapters };
});
export const updateNote = te.wrap(NOTE_STORE_NAME, 'readwrite', te.updateNote);

export const getChapter = te.wrap(CHAPTER_STORE_NAME, 'readonly', te.getChapter);
