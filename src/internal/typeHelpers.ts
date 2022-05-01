export type AnyArray<T> = T[] | ReadonlyArray<T>;

export type ExtractArrayType<T> = T extends Array<infer E>
  ? E
  : T extends ReadonlyArray<infer E>
  ? E
  : never;

export type OmitUnion<U, P extends string> = U extends any ? Omit<U, P> : never;

export type RecordValues<R> = R extends Record<infer K, infer V> ? V : never;
