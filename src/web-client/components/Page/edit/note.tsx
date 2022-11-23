import {FC, useState, Suspense, } from "react";
import styled from "styled-components";
import { ChapterInfo, NoteInfo, PageInfo, updateNote } from '~/idb/query';
import { Loadable} from "~/web-client/scripts/promise";
import {usePageEdit} from "~/web-client/scripts/reactive-edit";
import {AutoResizeTextarea} from "../../textarea";

export const NoteEdit = styled<FC<{ noteInfo: Loadable<NoteInfo> }>>(({ noteInfo, ...props }) => {
  const note = noteInfo.get();
  const [editing, setEditing] = useState(false);
  const [options, setOptions] = useState(note.options);
  const [name, setName] = useState(note.name);
  const save = () => {
    setEditing(false);
    updateNote(note.id, { name, options });
  };

  const title = editing ?
    <h1>
      <input type='text' value={ name } onChange={ ev => setName(ev.target.value) } autoFocus/>
      <button onClick={ save }>SAVE</button>
    </h1>
      :
    <h1>
      <div>{ name }</div>
      <button onClick={ () => setEditing(true) }>EDIT</button>
    </h1>
  ;

  return <div {...props}>
    { title }
    <ol>
        { note.chapters.map(chapter => <li key={chapter.id}><ChapterEdit chapter={chapter} /></li>) }
        <li><button>+ NEW CHAPTER</button></li>
    </ol>
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
    }
  }
  > ol {
    padding: .5rem;
    list-style: none;

    > li {
        padding-inline: 0;
        font-size: 1.25rem;
        line-height: 2;

        :last-child {
            text-align: end;
            > button {
                border: none;
                padding: 0;
            }
        }
    }
  }
`;

const ChapterEdit = styled<FC<{chapter: ChapterInfo}>>(({chapter , ...props }) => {
  return <div {...props}>
    <h2>{chapter.name}</h2>
    <Suspense fallback={null}>
      <ol>
        { chapter.pages.map((page) => <li key={page.id}><PageEdit page={page} /></li>) }
        <li><button>+ NEW PAGE</button></li>
      </ol>
    </Suspense>
  </div>;
})`
  > h2 {
    font-size: inherit;
    :before {
      display: inline-block;
      content: var(--wedge-url);
      width: 1rem;
    }
  }
  > ol {
    padding-inline-start: 1rem;
    list-style: none;

    > li {
      border-block-start: 1px solid gray;
      padding-inline-start: .5rem;
      font-size: 1.25rem;
      line-height: 2;

      :last-child {
          text-align: end;
          > button {
              padding: 0;
          }
      }
    }
  }
`;

const PageEdit = styled<FC<{page: PageInfo}>>(({ page: { id, headline } , ...props }) => {
  const [editing, setEditing] = useState(false);
  const [page, setPage, save] = usePageEdit(id, editing);
  if (page == null || !editing) return <div {...props}><h3 onClick={() => {setEditing(true);}}>{ page?.headline ?? headline}</h3></div>;
  return <div {...props}>
    <h3>
      <input type='text' value={ page.headline } onChange={ ev => setPage(p => ({ ...p!, headline: ev.target.value }))} autoFocus/>
      <button onClick={() => {setEditing(false); save();}}>OK</button>
    </h3>
    <div>
      <ul>
        { page.content.items.map((item, i) => {
          const update = (text: string) => setPage(p => ({...p!, content: {...p!.content, items: p!.content.items.map((v, j) => j == i ? { type: 'text', text } : v)}}));
          const remove = () => setPage(p => ({...p!, content: {...p!.content, items: p!.content.items.filter((_,j) => i !== j )}}));
          return <li key={i}><div>
            <input type="text" value={ item.text } onChange={ev => update(ev.target.value) }/>
            <button onClick={remove}>x</button>
          </div></li>
        }) }
        <li><button onClick={() => setPage(p => ({...p!, content: {...p!.content, items: p!.content.items.concat({ type: 'text', text: "" })}}))}>+</button></li>
      </ul>
      <AutoResizeTextarea value={ page.content.detail } update={ detail => setPage(p => ({ ...p!, content: {...p!.content, detail }}))} />
    </div>
  </div>;
})`
> h3 {
  display: flex;
  font-size: inherit;
  align-items: center;
  > input {
    flex-grow: 1;
  }
  > button {
    flex-shrink: 0;
  }
}
> div {
  font-size: 1rem;
  > ul {
    padding-inline-start: 1rem;
    list-style: var(--wedge-url);
    > li > div {
      display: flex;
      > input {
        flex-grow: 1;
      }
      > button {
        cursor: pointer;
      }
    }
  }
  > textarea {
    box-sizing: border-box;
    border: none;
    font-size: inherit;
    line-height: inherit;
    width: 100%;
    resize: none;
    background-color: transparent;
  }
}
`;

