import { useState, VFC } from "react";
import { NoteList } from "./note-list";
import { ChapterId, NoteId, Page, PageId } from "~/idb/data-structure";
import { Note } from "./note";
import { Chapter } from "./chapter";

type State =
  | { edge: 'none' }
  | { edge: 'note', noteId: NoteId }
  | { edge: 'chapter', noteId: NoteId, chapterId: ChapterId }
  | { edge: 'page', noteId: NoteId, chapterId: ChapterId, pageId: PageId }

const Page: VFC = () => {
    const [state, setState] = useState<State>({ edge: 'none' })
    switch (state.edge) {
        case 'note': return <Note noteId={ state.noteId } navigate={ chapterId => setState({ ...state, edge: 'chapter', chapterId })}/>;
        case 'chapter': return <Chapter chapterId={ state.chapterId } navigate={ pageId => setState({ ...state, edge: 'page', pageId })}/>;
        default: return <NoteList navigate={ noteId => setState({ edge: 'note', noteId }) }/>;
    }
}

export default Page;
