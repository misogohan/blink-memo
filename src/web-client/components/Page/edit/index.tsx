import { Suspense, useMemo, VFC } from "react";
import {getNote} from "~/idb/query";
import {sync} from "~/web-client/scripts/promise";
import {NoteEdit} from "./note";
export { NoteList as List } from "./note-list";

const Edit: VFC<{ id: string }> = ({ id }) => {
  const noteId = +id;
  const note = useMemo(() => sync(getNote(noteId)), [noteId]);
  return <Suspense fallback={null}>
    <NoteEdit noteInfo={note} />
  </Suspense>;
}

export default Edit;
