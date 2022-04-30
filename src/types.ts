import { GetPagePropertyResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';

export type NotionDatabase = Extract<
  SearchResponse['results'][number],
  { object: 'database'; title: any[] }
>;
export type NotionProperty = GetPagePropertyResponse;

export interface BaseEntity {
  id: string;
}

export type Filter<EntityType extends BaseEntity> = any;
