import { VFC, useMemo, useState, Suspense } from "react";
import styled from "styled-components";
import { Chapter, Note } from "~/idb/data-structure";
import { getChapter, updateNote } from '~/idb/query';
import { Loadable, sync } from "~/web-client/scripts/promise";

export const NoteEdit = styled<VFC<{ noteInfo: Loadable<Note> }>>(({ noteInfo, ...props }) => {
  const note = noteInfo.get();
  const chapters = useMemo(() => note.chapters.map(getChapter).map(sync), [note.chapters]);

  const [editing, setEditing] = useState(false);
  const [options, setOptions] = useState(note.options);
  const [name, setName] = useState(note.name);
  const save = () => {
    updateNote(note.id, { name, options }).then(() => setEditing(false));
  };

  return <div {...props}>
    <h1>
      { editing ? <> <input type='text' value={ name } onChange={ ev => setName(ev.target.value) } autoFocus/>
        <button onClick={ save }>SAVE</button>
      </> : <>
        <div>{ name }</div>
        <button onClick={ () => setEditing(true) }>EDIT</button>
      </> }
    </h1>
    <Suspense fallback={<p>wait a minute</p>}>
      <ol>
        <li><button>+ NEW CHAPTER</button></li>
        { chapters.map((chapter, i) => <li key={note.chapters[i]}><ChapterEdit chapter={chapter} /></li>) }
      </ol>
    </Suspense>
  </div>
})`
> h1 {
  display: flex;
  padding-inline: 1rem;
  line-height: 2;
  align-items: center;

  > input, > div {
    flex-grow: 1;
    display: inline-block;
    border: none;
    border-block-end: 1px solid transparent;
    padding: 0;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    font-family: inherit;
  }
  > input {
    min-width: 0;
    background-color: unset;
    :focus-visible {
      border-block-end: 1px solid #66F;
      outline: none;
    }
  }

  > button {
    flex-shrink: 0;
    border: none;
    padding: 0 .5rem;
    color: inherit;
    font-size: 1rem;
    background-color: transparent;
  }
}
  > ol {
    padding: 1rem;
    list-style: none;

    > li {
        border-block-end: 1px solid gray;
        padding-inline: .5rem;
        font-size: 1.25rem;
        line-height: 2;

        :first-child {
            text-align: end;
            > button {
                border: none;
                font-size: 1rem;
                color: inherit;
                background-color: transparent;
            }
        }

        > a {
            color: inherit;
            text-decoration: none;
        }
    }
  }
`;

const ChapterEdit = styled<VFC<{chapter: Loadable<Chapter>}>>(({ chapter : loadable, ...props }) => {
  const chapter = loadable.get();
  return <div {...props}>
    {chapter.name}
  </div>;
})`
`;


