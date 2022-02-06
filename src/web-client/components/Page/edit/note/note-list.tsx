import { Suspense, useMemo, useState, VFC } from "react";
import styled from "styled-components";
import { Note, NoteId } from "~/idb/data-structure";
import { NOTE_STORE_NAME } from "~/idb/definition";
import { getNotes as executerToGetNotes, updateNote as executerToUpdateNote, getTransactionExecution } from "~/idb/transaction-executer";
import { Loadable, sync } from "~/web-client/scripts/promise";

const getNotes = getTransactionExecution(NOTE_STORE_NAME, 'readonly', executerToGetNotes);
const updateNote = getTransactionExecution(NOTE_STORE_NAME, 'readwrite', executerToUpdateNote);

export const NoteList = styled<VFC<{ navigate: (noteId: NoteId) => void }>>(({ navigate, ...props }) => {
    const notesLoadable = useMemo(() => sync(getNotes()), []);

    return <div {...props}>
        <h2>Choose a Note to Edit</h2>
        <Suspense fallback={<p>loading...</p>}>
            <Notes notes={notesLoadable} navigate={navigate}/>
        </Suspense>
    </div>
})`
    > h2 {
        padding-inline: 1rem;
        line-height: 2;
    }
`

const Notes = styled<VFC<{ notes: Loadable<Note[]>, navigate: (noteId: NoteId) => void }>>(({ notes, navigate, ...props }) => {
    const data = notes.get();

    return <ul {...props}>
        {
            data.map(note => <li key={note.id} onClick={() => navigate(note.id)}><NoteNameEditor note={ note }/></li>)
        }
        <li><button>+ add a new note</button></li>
    </ul>
})`
    padding: 1rem;
    list-style: none;

    > li {
        border-block-start: 1px solid gray;
        padding-inline: .5rem;
        font-size: 1.25rem;
        line-height: 2;
    }
`;

const NoteNameEditor = styled<VFC<{ note: Pick<Note, 'id' | 'name'> }>>(({ note, ...props })=>{
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(note.name);
    const [saving, setSaving] = useState(false);
    const save = () => {
        setSaving(true);
        updateNote(note.id, { name }).then(() => {
            setSaving(false);
        });
    };

    if (editing) return <div {...props}>
        <input type='text' value={ name } onChange={ ev => setName(ev.target.value) }/>
        <button disabled={ saving } onClick={ save }>SAVE</button>
    </div>;
    else return <div {...props}>
        <span>{ name }</span>
        <button onClick={ () => setEditing(true) }>EDIT</button>
    </div>
})`
    padding: .5rem;
    
    > input, > span {
        display: inline-block;
        border: none;
        border-block-end: 1px solid transparent;
        background: none;
        color: inherit;
        font-size: 1.5rem;
        line-height: 2rem;
        :focus-visible {
            border-block-end: 1px solid #66F;
            outline: none;
        }
    }
`
