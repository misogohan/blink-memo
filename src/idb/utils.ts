export type IDBErrorHandler = (error: DOMException) => void;

export const $ = <T>(req: IDBRequest<T>, resolve: (v: T) => void, reject: (v: any) => void = () => {}) => {
  if (req.readyState === "done") resolve(req.result);
  else {
    req.addEventListener('success', function on() {
      req.removeEventListener('success', on);
      resolve(this.result);
    });
    req.addEventListener('error', reject);
  }
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

