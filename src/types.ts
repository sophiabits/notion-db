import { GetPagePropertyResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';

import type { GetFromUnion } from './internal/typeHelpers';

export type NotionDatabase = GetFromUnion<SearchResponse['results'][number], 'object', 'database'>;
export type NotionProperty = GetPagePropertyResponse;

export interface BaseEntity {
  id: string;
}

export type Filter<EntityType extends BaseEntity> = any;
