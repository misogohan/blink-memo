import {useEffect, useState} from "react";
import {Page, PageId} from "~/idb/data-structure";
import {getPage, updatePage} from "~/idb/query";


export const usePageEdit = (id: PageId, editing: boolean) => {
  const [page, setPage] = useState<Page | undefined>(undefined);
  useEffect(() => {
    setPage(undefined);
    if (editing) getPage(id).then(setPage);
  }, [editing]);

  const save = () => {
    if (page != null) updatePage(id, page);
  }

  return [page, setPage, save] as const;
}
