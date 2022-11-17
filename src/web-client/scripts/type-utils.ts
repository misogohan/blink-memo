export type Result<T> = Ok<T> | Err;

export type Ok<T> = {
  status: 'ok';
  value: T;
};
export const ok = <T>(value: T): Ok<T> => ({ status: 'ok', value });
export type Err = {
  status: 'err';
  error: string;
};
export const err = (message: string): Err => ({ status: 'err', error: message });
