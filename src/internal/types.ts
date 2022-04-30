import { GetPagePropertyResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';

// Notion API types
export type NotionDatabase = Extract<
  SearchResponse['results'][number],
  { object: 'database'; title: any[] }
>;
export type NotionProperty = GetPagePropertyResponse;
export type NotionRecord = {
  id: string;
  parent: { type: 'database_id'; database_id: string };
  properties: Record<string, NotionProperty>;
};

// Internal metadata
export interface DatabaseMetadata {
  id: string;
  propertiesMap: Record<string, string>;
}
