import { VFC, useMemo, Suspense, useState } from "react";
import styled from "styled-components";
import { Chapter, ChapterId, Note, NoteId } from "~/idb/data-structure";
import { CHAPTER_STORE_NAME, NOTE_STORE_NAME } from "~/idb/definition";
import { getNote as executerToGetNote,  getChapters as executerToGetChapters, updateChapter as executerToUpdateChapter, getTransactionExecution } from "~/idb/transaction-executer";
import { Loadable, sync } from "~/web-client/scripts/promise";

const getNote = getTransactionExecution(NOTE_STORE_NAME, 'readonly', executerToGetNote);
const getChapters = getTransactionExecution(CHAPTER_STORE_NAME, 'readonly', executerToGetChapters);
const updateChapter = getTransactionExecution(NOTE_STORE_NAME, 'readwrite', executerToUpdateChapter);

const Note: VFC<{ noteId: NoteId, navigate: (chapterId: ChapterId) => void }> = ({ noteId, navigate }) => {
    const noteLoadable = useMemo(() => sync(getNote(noteId)), [noteId]);
    const chaptersLoadable = useMemo(() => sync(getChapters(noteId)), [noteId]);

    return <div>
        <Suspense fallback={<p>loading...</p>}>
            <NoteView note={noteLoadable}/>
            <Chapters chapters={chaptersLoadable} navigate={navigate}/>
        </Suspense>
    </div>
}
export { Note };

const NoteView = styled<VFC<{note: Loadable<Note | undefined>}>>(({ note, ...props }) => {
    const data = note.get();
    if (data == null) return <p>Non-existent Note</p>;

    return <h2 {...props}>{data.name}</h2>
})`
    padding-inline: 1rem;
    line-height: 2;
`;

const Chapters = styled<VFC<{ chapters: Loadable<Chapter[]>, navigate: (chapterId: ChapterId) => void }>>(({ chapters, navigate, ...props }) => {
    const data = chapters.get();

    return <ol {...props}>
        {
            data.map(chapter => <li key={ chapter.id } onClick={() => navigate(chapter.id)}><ChapterNameEditor chapter={chapter}/></li>)
        }
        <li><button>+ add a new chapter</button></li>
    </ol>
})`
    padding: 1rem;
    list-style: none;

    > li {
        border-block-start: 1px solid gray;
        padding-inline: .5rem;
        font-size: 1.25rem;
        line-height: 2;
        > a {
            text-decoration: none;
        }
    }
`;


const ChapterNameEditor = styled<VFC<{ chapter: Pick<Chapter, 'id' | 'name'> }>>(({ chapter, ...props })=>{
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(chapter.name);
    const [saving, setSaving] = useState(false);
    const save = () => {
        setSaving(true);
        updateChapter(chapter.id, { name }).then(() => {
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
