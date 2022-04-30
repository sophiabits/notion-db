import _ from 'lodash';
import type { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';

import { DatabaseMetadata, NotionDatabase } from './internal/types';

import { BaseEntity, Filter, FilterSelector } from './types';

type NotionPropertyFilter = Extract<QueryDatabaseParameters['filter'], { type?: string }>;
type NotionCheckboxPropertyFilter = Extract<NotionPropertyFilter, { checkbox: any }>['checkbox'];
type NotionNumberPropertyFilter = Extract<NotionPropertyFilter, { number: any }>['number'];
type NotionSelectPropertyFilter = Extract<NotionPropertyFilter, { select: any }>['select'];
// Covers: email, phone_number, rich_text, title, url
type NotionTextPropertyFilter = Extract<NotionPropertyFilter, { rich_text: any }>['rich_text'];

// TODO
// type NotionMultiSelectPropertyFilter = Extract<
//   NotionPropertyFilter,
//   { multi_select: any }
// >['multi_select'];

// TODO: date, people, relation, rollup

export function buildQuery<EntityType extends BaseEntity>(
  database: NotionDatabase,
  meta: DatabaseMetadata,
  filter: Filter<EntityType> = {},
): QueryDatabaseParameters {
  const query: QueryDatabaseParameters = {
    database_id: meta.id,
  };

  const conditions: NotionPropertyFilter[] = [];
  for (const key of Object.keys(filter)) {
    const selector = filter[key as keyof Filter<EntityType>];
    if (!selector || Object.keys(selector).length === 0) continue;

    const definition = database.properties[key];
    if (!definition) {
      throw new Error(`Invalid filter property: ${key}`);
    }

    switch (definition.type) {
      case 'checkbox':
        pushBooleanSelector(conditions, definition.type, key, selector);
        break;

      case 'number':
        pushNumericSelector(conditions, definition.type, key, selector);
        break;

      case 'select':
        pushSelectSelector(conditions, definition.type, key, selector);
        break;

      case 'email':
      case 'phone_number':
      case 'rich_text':
      case 'title':
      case 'url':
        pushStringSelector(conditions, definition.type, key, selector);
        break;
    }
  }

  if (conditions.length > 0) {
    query.filter = { and: conditions };
  }

  return query;
}

function pushBooleanSelector(
  conditions: NotionPropertyFilter[],
  type: 'checkbox',
  property: string,
  selector: FilterSelector,
) {
  const filter: NotionCheckboxPropertyFilter = {
    equals: selector.$eq,
    does_not_equal: selector.$ne,
  };

  conditions.push({
    [type]: filter,
    property,
    type,
  });
}

function pushNumericSelector(
  conditions: NotionPropertyFilter[],
  type: 'number',
  property: string,
  selector: FilterSelector,
) {
  const filter: NotionNumberPropertyFilter = {
    equals: selector.$eq,
    does_not_equal: selector.$ne,
    greater_than: selector.$gt,
    greater_than_or_equal_to: selector.$gte,
    less_than: selector.$lt,
    less_than_or_equal_to: selector.$lte,
  };

  conditions.push({
    [type]: filter,
    property,
    type,
  });
}

function pushSelectSelector(
  conditions: NotionPropertyFilter[],
  type: 'select',
  property: string,
  selector: FilterSelector,
) {
  const filter: NotionSelectPropertyFilter = {
    equals: selector.$eq,
    does_not_equal: selector.$ne,
  };

  conditions.push({
    [type]: filter,
    property,
    type,
  });
}

function pushStringSelector(
  conditions: NotionPropertyFilter[],
  type: 'email' | 'phone_number' | 'rich_text' | 'title' | 'url',
  property: string,
  selector: FilterSelector,
) {
  const filter: NotionTextPropertyFilter = {
    equals: selector.$eq,
    does_not_equal: selector.$ne,
  };

  // @ts-ignore
  conditions.push({
    [type]: filter,
    property,
    type,
  });
}
