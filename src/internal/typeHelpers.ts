export type AnyArray<T> = T[] | ReadonlyArray<T>;

export type ExtractArrayType<T> = T extends Array<infer E>
  ? E
  : T extends ReadonlyArray<infer E>
  ? E
  : never;

export type RecordValues<T> = T extends Record<infer K, infer V> ? V : never;
