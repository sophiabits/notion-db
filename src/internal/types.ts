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

// == Notion API types

export type NotionDatabase = Extract<
  SearchResponse['results'][number],
  { object: 'database'; title: any[] }
>;
export type NotionParentDatabase = {
  type: 'database_id';
  database_id: string;
};

/**
 * Notion has a slightly different `properties` type across get, create, & update
 * requests. This type is a union of all the different possible API responses.
 *
 * This type should be normalized into
 */
export type NotionPropertiesMap =
  | Record<string, NotionPropertyRaw>
  | Extract<CreatePageResponse, { properties: any }>['properties']
  | Extract<UpdatePageResponse, { properties: any }>['properties'];

/** Schema for a particular property inside {@link NotionDatabase} */
export type NotionPropertyDefinition = RecordValues<NotionDatabase['properties']>;
type NotionPropertyRaw = OmitUnion<GetPagePropertyResponse, 'id' | 'object'>;

/**
 * Normalized Notion property type, derived from {@link NotionPropertiesMap}
 */
export type NotionPropertyDefinitionSafe = Extract<
  NotionPropertyDefinition,
  { type: SupportedNotionPropertyTypes }
>;
export type NotionPropertySafe = Extract<NotionPropertyRaw, { type: SupportedNotionPropertyTypes }>;
export type NotionPropertiesMapSafe = Record<string, NotionPropertySafe>;

/**
 * Notion database record retrieved from the API.
 */
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
export type NotionRecordInput = {
  parent: NotionParentDatabase;
  properties: Record<string, NotionPropertyInput>;
};

// == Library types

export type PropertiesMap = Record<string, string>;

export interface DatabaseMetadata {
  id: string;
  propertiesMap: PropertiesMap;
}
