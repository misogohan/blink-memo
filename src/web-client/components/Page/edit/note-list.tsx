import { Suspense, useMemo, FC } from "react";
import { Link } from "rocon/react";
import styled from "styled-components";
import { Note } from "~/idb/data-structure";
import { getNoteList } from '~/idb/query';
import { editRoute } from "~/web-client/routes";
import { Loadable, sync } from "~/web-client/scripts/promise";

export const NoteList = styled<FC>(({ ...props }) => {
    const notesLoadable = useMemo(() => sync(getNoteList()), []);

    return <div {...props}>
      <h1>ノート一覧</h1>
      <nav><button>+ NEW NOTE</button></nav>
      <Suspense fallback={null}>
        <Notes notes={notesLoadable}/>
      </Suspense>
    </div>
})`
  h1 {
    padding-inline: 1rem;
    line-height: 2;
  }
  nav {
    padding-inline: 1rem;
    text-align: end;
    > button {
      border: none;
      padding: 0;
      font-size: 1rem;
      color: inherit;
      background-color: transparent;
    }
  }
`

const Notes = styled<FC<{ notes: Loadable<Note[]> }>>(({ notes, ...props }) => {
    const data = notes.get();

    // TODO: add handler for new note button
    return <ul {...props}>
        { data.map(({ id, name }) =>
          <li key={ id }>
            <Link route={editRoute.route} match={{ id: "" + id }}>{name}</Link>
          </li>
        ) }
    </ul>
})`
    padding: 0 1rem;
    list-style: none;

    > li {
        border-block-end: 1px solid gray;
        padding-inline: .5rem;
        font-size: 1.25rem;
        line-height: 2;


        > a {
            display: block;
            color: inherit;
            text-decoration: none;
        }
    }
`;

