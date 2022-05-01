import {
  CreatePageParameters,
  CreatePageResponse,
  GetPagePropertyResponse,
  SearchResponse,
  UpdatePageResponse,
} from '@notionhq/client/build/src/api-endpoints';

import type { OmitUnion, RecordValues } from './typeHelpers';

type SupportedNotionPropertyTypes =
  | 'checkbox'
  | 'email'
  | 'multi_select'
  | 'number'
  | 'phone_number'
  | 'rich_text'
  | 'select'
  | 'title'
  | 'url';

// Notion API types
export type NotionDatabase = Extract<
  SearchResponse['results'][number],
  { object: 'database'; title: any[] }
>;
export type NotionParentDatabase = {
  type: 'database_id';
  database_id: string;
};

export type NotionUpsertPropertiesMap =
  | Record<string, NotionPropertyRaw>
  | Extract<CreatePageResponse, { properties: any }>['properties']
  | Extract<UpdatePageResponse, { properties: any }>['properties'];

export type NotionPropertyDefinition = RecordValues<NotionDatabase['properties']>;
export type NotionPropertyRaw = OmitUnion<GetPagePropertyResponse, 'id' | 'object'>;
export type NotionPropertySafe = Extract<NotionPropertyRaw, { type: SupportedNotionPropertyTypes }>;
export type NotionRecord = {
  id: string;
  parent: NotionParentDatabase;
  properties: Record<string, NotionPropertyRaw>;
};
// Used for creating new Notion records
export type NotionPropertyInput = Extract<
  Exclude<RecordValues<CreatePageParameters['properties']>, boolean | number | string>,
  { type?: SupportedNotionPropertyTypes }
>;
export type NotionPropertiesInput = CreatePageParameters['properties'];

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
