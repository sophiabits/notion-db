import _ from 'lodash';
import { Client } from '@notionhq/client';

import { isNotionDatabase } from './internal/typeguards';
import type { DatabaseMetadata, NotionDatabase } from './internal/types';

type DatabaseMap = Map<string, DatabaseMetadata>;

export class Connection {
  private constructor(private client: Client, private dbs: DatabaseMap) {}

  static async withToken(apiToken: string) {
    const client = new Client({
      auth: apiToken,
    });
    const dbs = await fetchDatabasesMap(client);

    const connection = new Connection(client, dbs);
    return connection;
  }

  database(name: string) {
    // TODO
  }
}

async function fetchDatabasesMap(client: Client): Promise<DatabaseMap> {
  const searchResponse = await client.search({
    filter: { property: 'object', value: 'database' },
  });

  // TODO: Paginate data when necessary

  const map = new Map<string, DatabaseMetadata>();
  for (const it of searchResponse.results) {
    if (isNotionDatabase(it)) {
      const title = getDatabaseTitle(it);
      map.set(title, {
        id: it.id,
        propertiesMap: Object.keys(it.properties).reduce(
          (acc, key) => ({
            ...acc,
            [_.camelCase(key)]: key,
          }),
          {},
        ),
      });
    } else {
      console.warn(`Found non-DB search result with id: ${it.id}`);
    }
  }
  return map;
}

function getDatabaseTitle(database: NotionDatabase) {
  const title = database.title.find((it) => it.type === 'text');
  if (title) {
    return _.lowerCase(title.plain_text.trim());
  } else {
    throw new Error(`Could not determine title of database (id=${database.id})`);
  }
}
