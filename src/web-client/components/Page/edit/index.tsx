import { Suspense, useMemo, FC } from "react";
import {getNoteInfo} from "~/idb/query";
import {sync} from "~/web-client/scripts/promise";
import {NoteEdit} from "./note";
export { NoteList as List } from "./note-list";

const Edit: FC<{ id: string }> = ({ id }) => {
  const noteId = +id;
  const note = useMemo(() => sync(getNoteInfo(noteId)), [noteId]);
  return <Suspense fallback={null}>
    <NoteEdit noteInfo={note} />
  </Suspense>;
}

export default Edit;
