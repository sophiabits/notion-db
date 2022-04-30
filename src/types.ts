import type { AnyArray, ExtractArrayType } from './internal/typeHelpers';

export interface BaseEntity {
  id: string;
}

export type Filter<EntityType extends BaseEntity> = {
  [Prop in keyof EntityType]?: FilterSelector<EntityType[Prop]>;
};

// Stolen from mongoose :)
// See: https://github.com/Automattic/mongoose/blob/f7fe2c7dae23e0702f554965e0055c5b27eadbfb/types/index.d.ts#L2048
export type FilterSelector<T = any> = {
  $eq?: T;
  $gt?: T;
  $gte?: T;
  $in?: T extends AnyArray<any> ? ExtractArrayType<T>[] : T[];
  $lt?: T;
  $lte?: T;
  $ne?: T;
  $nin?: T extends AnyArray<any> ? ExtractArrayType<T>[] : T[];
};
