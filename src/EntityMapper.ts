import _ from 'lodash';

import type { NotionDatabase, NotionProperty, NotionRecord, PropertiesMap } from './internal/types';
import type { BaseEntity } from './types';

export function mapNotionToEntity<E extends BaseEntity>(
  notion: NotionRecord,
  propertiesMap: PropertiesMap,
): E {
  const notionPropToJs = _.invert(propertiesMap);

  // @ts-ignore
  return {
    ...Object.fromEntries(
      Object.entries(notion.properties).map(([key, value]) => [
        notionPropToJs[key],
        getJSValueFromNotion(value),
      ]),
    ),
    id: notion.id,
  };
}

export function mapEntityToNotion<E extends BaseEntity>(
  database: NotionDatabase,
  entity: E,
): NotionRecord {
  // TODO
  return {
    parent: { database_id: database.id, type: 'database_id' },
    id: entity.id,
    properties: {},
  };
}

function getJSValueFromNotion(property: NotionProperty) {
  switch (property.type) {
    case 'checkbox':
      return property.checkbox;

    // case 'created_by':
    // case 'created_time':
    // case 'date':
    case 'email':
      return property.email;
    // case 'files':
    // case 'formula':
    // case 'last_edited_by':
    // case 'last_edited_time':
    // case 'multi_select':
    case 'number':
      return property.number;
    // case 'people':
    case 'phone_number':
      return property.phone_number;
    // case 'property_item':
    // case 'relation':
    // case 'rich_text':
    // case 'rollup':
    // case 'select':
    // case 'title':
    case 'title':
      if (Array.isArray(property.title)) {
        return property.title.reduce((acc, it) => acc + it.plain_text, '');
      } else {
        return property.title.plain_text;
      }

    case 'url':
      return property.url;

    default:
      console.error('Unknown property:', property);
  }
}
