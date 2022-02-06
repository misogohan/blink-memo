import { VFC, useMemo, Suspense } from "react";
import styled from "styled-components";
import { Page, Chapter, ChapterId, PageId } from "~/idb/data-structure";
import { PAGE_STORE_NAME, CHAPTER_STORE_NAME } from "~/idb/definition";
import { getPages as executerToGetPages, getChapter as executerToGetChapter, getTransactionExecution } from "~/idb/transaction-executer";
import { Loadable, sync } from "~/web-client/scripts/promise";

const getChapter = getTransactionExecution(CHAPTER_STORE_NAME, 'readonly', executerToGetChapter);
const getPages = getTransactionExecution(PAGE_STORE_NAME, 'readonly', executerToGetPages);

const Chapter = styled<VFC<{ chapterId: ChapterId, navigate: (pageId: PageId) => void }>>(({ chapterId, navigate, ...props }) => {
    const chapterLoadable = useMemo(() => sync(getChapter(chapterId)), [chapterId]);
    const pagesLoadable = useMemo(() => sync(getPages(chapterId)), [chapterId]);

    return <div {...props}>
        <Suspense fallback={<p>loading...</p>}>
            <ChapterEditor chapter={chapterLoadable}/>
            <Pages pages={pagesLoadable} navigate={navigate}/>
        </Suspense>
    </div>
})`
`;
export { Chapter }

const ChapterEditor = styled<VFC<{chapter: Loadable<Chapter | undefined>}>>(({ chapter, ...props }) => {
    const data = chapter.get();
    if (data == null) return <p>Non-existent Chapter</p>;

    return <h2 {...props}>{data.name}</h2>
})`
    padding-inline: 1rem;
    line-height: 2;
`;

const Pages = styled<VFC<{ pages: Loadable<Page[]>, navigate: (pageId: PageId) => void }>>(({pages, navigate, ...props}) => {
    const data = pages.get();

    return <ol {...props}>
        {
            data.map(({ id, headline }) => <li key={ id } onClick={() => navigate(id)}>{ headline }</li>)
        }
        <li><button>+ add a new page</button></li>
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
`
