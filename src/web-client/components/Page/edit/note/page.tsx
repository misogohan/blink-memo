import { Suspense, useMemo, useState, VFC } from "react";
import { Page, PageId } from "~/idb/data-structure";
import { PAGE_STORE_NAME } from "~/idb/definition";
import { getPage as executerToGetPage, updatePage as executerToUpdatePage, getTransactionExecution } from "~/idb/transaction-executer";
import { Loadable, sync } from "~/web-client/scripts/promise";

const getPage = getTransactionExecution(PAGE_STORE_NAME, 'readonly', executerToGetPage);
const updatePage = getTransactionExecution(PAGE_STORE_NAME, 'readwrite', executerToUpdatePage);

const Page: VFC<{ pageId: PageId, back: () => void }> = ({ pageId, back }) => {
    const pageLoadable = useMemo(() => sync(getPage(pageId)), [pageId]);

    return <div>
        <Suspense fallback={<p>loading...</p>}>
            <PageEditor page={pageLoadable}/>
        </Suspense>
    </div>
}

const PageEditor: VFC<{ page: Loadable<Page | undefined>}> = ({ page }) => {
    const data = page.get();
    if (data == null) return <p>Non-Existent Page</p>
    const [headline, setHeadline] = useState(data.headline);
    const [items, setItems] = useState(data.content.items);
    const [detail, setDetail] = useState(data.content.detail);
    const [textFlow, setTextFlow] = useState(data.options.textFlow);
    const [saving, setSaving] = useState(false);



    const save = () => {
        setSaving(true);
        updatePage(data.id, { headline, content: { items, detail }, options: { textFlow }}).then(() => {
            setSaving(false);
        })
    }

    return <form>
        <input type='text' value={headline}/>
        <ul>
            { items.map(item => <li key={item.text}>{item.text}</li>) }
        </ul>
    </form>
}
