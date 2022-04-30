import type { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { DatabaseMetadata, NotionDatabase } from './internal/types';

import { BaseEntity, Filter } from './types';

export function buildQuery<EntityType extends BaseEntity>(
  database: NotionDatabase,
  meta: DatabaseMetadata,
  filter?: Filter<EntityType>,
): QueryDatabaseParameters {
  return {
    database_id: meta.id,
  };
}
