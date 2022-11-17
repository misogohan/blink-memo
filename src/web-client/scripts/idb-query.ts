import {useMemo} from "react";
import {NoteId} from "~/idb/data-structure";
import {getNote} from "~/idb/query";
import {sync} from "./promise";


const useNoteEdit = (id: NoteId) => {
  const noteData = useMemo(() => sync(getNote(id)), [id]);
};
