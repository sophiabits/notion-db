import type { BaseEntity } from '../types';
import { Connection } from '../Connection';
import { Repository } from '../Repository';

interface Note extends BaseEntity {
  name: string;
}

describe('Repository', () => {
  let conn: Connection;
  let repo: Repository<Note>;

  beforeAll(async () => {
    conn = await Connection.withToken(process.env.NOTION_TOKEN!);
    repo = conn.database('notes');
  });

  it('can find rows by id', async () => {
    const row = await repo.findById('e4d1e3a750fc46a399aee2808ddff99b');
    expect(row!.name).toBe('Testing');
  });
});
