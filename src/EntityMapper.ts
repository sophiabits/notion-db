import _ from 'lodash';
import { assertUnreachable } from './internal/typeguards';

import type {
  NotionDatabase,
  NotionParentDatabase,
  NotionPropertyDefinition,
  NotionPropertyDefinitionSafe,
  NotionPropertyInput,
  NotionPropertySafe,
  NotionPropertiesMap,
  NotionRecord,
  NotionRecordInput,
  PropertiesMap,
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
    _.compact(
      Object.entries(entity).map(([key, value]) => {
        const notionPropertyName = propertiesMap[key];
        const notionPropertyDefinition = database.properties[notionPropertyName];

        if (isSupportedProperty(notionPropertyDefinition)) {
          return [notionPropertyName, getNotionValueFromJS(notionPropertyDefinition, value)];
        } else {
          return null;
        }
      }),
    ),
  );

  return {
    parent,
    properties,
  };
}

export function normalizeNotionProperties(
  input: NotionPropertiesMap,
): Record<string, NotionPropertySafe> {
  const properties: Record<string, NotionPropertySafe> = {};

  for (const [key, value] of Object.entries<RecordValues<NotionPropertiesMap>>(input)) {
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

function isSupportedProperty(
  property: NotionPropertyDefinition,
): property is NotionPropertyDefinitionSafe {
  const { type } = property;
  return (
    type === 'checkbox' ||
    type === 'email' ||
    type === 'multi_select' ||
    type === 'number' ||
    type === 'phone_number' ||
    type === 'rich_text' ||
    type === 'select' ||
    type === 'title'
  );
}

function getNotionValueFromJS(
  definition: NotionPropertyDefinitionSafe,
  value: unknown,
): NotionPropertyInput {
  switch (definition.type) {
    case 'checkbox':
      break;
    case 'email':
      break;
    case 'multi_select':
      break;
    case 'number':
      break;
    case 'phone_number':
      break;
    case 'rich_text':
      break;
    case 'select':
      break;
    case 'title':
      break;
    case 'url':
      break;
    default:
      assertUnreachable(definition);
  }

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
