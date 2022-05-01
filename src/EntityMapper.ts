import _ from 'lodash';
import { assertUnreachable } from './internal/typeguards';

import type {
  NotionDatabase,
  NotionParentDatabase,
  NotionPropertyDefinition,
  NotionPropertyInput,
  NotionRecord,
  NotionRecordInput,
  NotionUpsertPropertiesMap,
  PropertiesMap,
  NotionPropertySafe,
} from './internal/types';
import type { RecordValues } from './internal/typeHelpers';
import type { BaseEntity } from './types';

export function mapNotionToEntity<E extends BaseEntity>(
  notion: NotionRecord,
  propertiesMap: PropertiesMap,
): E {
  const notionPropToJs = _.invert(propertiesMap);
  const notionProperties = normalizeNotionProperties(notion.properties);

  // @ts-ignore
  return {
    ...Object.fromEntries(
      Object.entries(notionProperties).map(([key, value]) => [
        notionPropToJs[key],
        getJSValueFromNotion(value),
      ]),
    ),
    id: notion.id,
  };
}

export function mapEntityToNotion<E extends {}>(
  entity: E,
  database: NotionDatabase,
  propertiesMap: PropertiesMap,
): NotionRecordInput {
  const parent: NotionParentDatabase = {
    database_id: database.id,
    type: 'database_id',
  };

  const properties = Object.fromEntries(
    Object.entries(entity).map(([key, value]) => {
      const notionPropertyName = propertiesMap[key];
      const notionPropertyDefinition = database.properties[notionPropertyName];
      return [notionPropertyName, getNotionValueFromJS(notionPropertyDefinition as any, value)];
    }),
  );

  return {
    parent,
    properties,
  };
}

export function normalizeNotionProperties(
  input: NotionUpsertPropertiesMap,
): Record<string, NotionPropertySafe> {
  const properties: Record<string, NotionPropertySafe> = {};

  for (const [key, value] of Object.entries<RecordValues<NotionUpsertPropertiesMap>>(input)) {
    switch (value.type) {
      case 'rich_text':
        if (Array.isArray(value.rich_text)) {
          properties[key] = {
            // TODO this does not seem robust
            rich_text: _.first(value.rich_text)!,
            type: 'rich_text',
          };
        } else {
          properties[key] = {
            rich_text: value.rich_text,
            type: 'rich_text',
          };
        }
        break;
      case 'title':
        if (Array.isArray(value.title)) {
          properties[key] = {
            // TODO this does not seem robust
            title: _.first(value.title)!,
            type: 'title',
          };
        } else {
          properties[key] = {
            title: value.title,
            type: 'title',
          };
        }
        break;

      case 'checkbox':
      case 'email':
      case 'multi_select':
      case 'number':
      case 'phone_number':
      case 'select':
      case 'url':
        properties[key] = value;
        break;
    }
  }

  return properties;
}

function getNotionValueFromJS(
  definition: NotionPropertyDefinition,
  value: unknown,
): NotionPropertyInput {
  // TODO
  return value as any;
}

function getJSValueFromNotion(property: NotionPropertySafe) {
  switch (property.type) {
    case 'checkbox':
      return property.checkbox;
    case 'email':
      return property.email;
    case 'multi_select':
      return property.multi_select.map((it) => it.name);
    case 'number':
      return property.number;
    case 'phone_number':
      return property.phone_number;
    case 'rich_text':
      return property.rich_text;
    case 'select':
      return property.select?.name ?? null;
    case 'title':
      if (Array.isArray(property.title)) {
        return property.title.reduce((acc, it) => acc + it.plain_text, '');
      } else {
        return property.title.plain_text;
      }
    case 'url':
      return property.url;

    default:
      assertUnreachable(property);
  }
}
