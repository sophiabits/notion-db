export type AnyArray<T> = T[] | ReadonlyArray<T>;

export type ExtractArrayType<T> = T extends Array<infer E>
  ? E
  : T extends ReadonlyArray<infer E>
  ? E
  : never;

export type GetFromUnion<Union, Property extends keyof Union, Value> = Union extends any
  ? Union[Property] extends Value
    ? Union
    : never
  : never;
