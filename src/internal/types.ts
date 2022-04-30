import {
  CreatePageParameters,
  GetPagePropertyResponse,
  SearchResponse,
} from '@notionhq/client/build/src/api-endpoints';

import type { RecordValues } from './typeHelpers';

export type WithId<T extends {}> = T & { id: string };

// Notion API types
export type NotionDatabase = Extract<
  SearchResponse['results'][number],
  { object: 'database'; title: any[] }
>;
export type NotionParentDatabase = {
  type: 'database_id';
  database_id: string;
};
export type NotionProperty = GetPagePropertyResponse;
export type NotionPropertyDefinition = RecordValues<NotionDatabase['properties']>;
export type NotionRecord = {
  id: string;
  parent: NotionParentDatabase;
  properties: Record<string, NotionProperty>;
};
// Used for creating new Notion records
export type NotionPropertyInput = RecordValues<CreatePageParameters['properties']>;
export type NotionRecordInput = {
  parent: NotionParentDatabase;
  properties: Record<string, NotionPropertyInput>;
};

// Internal metadata
export type PropertiesMap = Record<string, string>;

export interface DatabaseMetadata {
  id: string;
  propertiesMap: PropertiesMap;
}
