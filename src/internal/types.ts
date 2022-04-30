import { GetPagePropertyResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';

import type { RecordValues } from './typeHelpers';

// Notion API types
export type NotionDatabase = Extract<
  SearchResponse['results'][number],
  { object: 'database'; title: any[] }
>;
export type NotionProperty = GetPagePropertyResponse;
export type NotionPropertyDefinition = RecordValues<NotionDatabase['properties']>;
export type NotionRecord = {
  id: string;
  parent: { type: 'database_id'; database_id: string };
  properties: Record<string, NotionProperty>;
};

// Internal metadata
export type PropertiesMap = Record<string, string>;

export interface DatabaseMetadata {
  id: string;
  propertiesMap: PropertiesMap;
}
