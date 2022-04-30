import { Client } from '@notionhq/client';

import { isNotionDatabase } from './internal/typeguards';
import type { NotionDatabase } from './types';

export class Connection {
  private constructor(private client: Client, private dbs: NotionDatabase[]) {}

  static async withToken(apiToken: string) {
    const client = new Client({
      auth: apiToken,
    });
    const dbs = await fetchDatabasesList(client);

    const connection = new Connection(client, dbs);
    return connection;
  }

  database(name: string) {
    // TODO
  }
}

async function fetchDatabasesList(client: Client): Promise<NotionDatabase[]> {
  const searchResponse = await client.search({
    filter: { property: 'object', value: 'database' },
  });

  // TODO: Paginate data when necessary

  const data: NotionDatabase[] = [];
  for (const it of searchResponse.results) {
    if (isNotionDatabase(it)) {
      data.push(it);
    } else {
      console.warn(`Found non-DB search result with id: ${it.id}`);
    }
  }
  return data;
}
