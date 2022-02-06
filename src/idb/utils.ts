export type IDBErrorHandler = (error: DOMException) => void;
export const $ = <T>(req: IDBRequest<T>, onsuccess: (v: T) => void, onerror?: IDBErrorHandler) => {
  req.addEventListener('success', () => onsuccess(req.result));
  if (onerror != null) req.addEventListener('error', () => onerror(req.error!));
  return req;
};
export const $$ = (req: ReturnType<IDBObjectStore['openCursor']>, onfind: (cursor: IDBCursorWithValue) => void, outranged?: (count: number) => void, onerror?: IDBErrorHandler) => {
  let count = 0;
  $(req, (v) => {
    if (v != null) {
      count++;
      onfind(v);
    } else outranged?.(count);
  }, onerror);
};

const comparator = <T extends string | number>(a: T, b: T) => {
  return a < b ? -1 : a > b ? 1 : 0;
};
export const onlyPermutated = <T extends string | number>(a: readonly T[], b: readonly T[]): boolean => {
  if (a.length !== b.length) return false;
  const A = Array.from(a).sort(comparator);
  const B = Array.from(b).sort(comparator);
  let i = 0, n = A.length;
  while (i < n) {
    if (A[i] === B[i]) ++i;
    else return false;
  }
  return true;
};

