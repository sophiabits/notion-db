import type { BaseEntity } from '../types';
import { Connection } from '../Connection';
import { Repository } from '../Repository';

interface Note extends BaseEntity {
  count: number;
  isDone: boolean;
  name: string;
}

describe('Repository', () => {
  let conn: Connection;
  let repo: Repository<Note>;

  beforeAll(async () => {
    conn = await Connection.withToken(process.env.NOTION_TOKEN!);
    repo = conn.database('notes');
  });

  describe('find', () => {
    it('can find rows by id', async () => {
      const row = await repo.findById('e4d1e3a750fc46a399aee2808ddff99b');
      expect(row!.name).toBe('Testing');
    });

    it('$lt', async () => {
      const rows = await repo.find({
        count: { $lt: 10 },
      });
      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('Testing');
    });

    it('$gt', async () => {
      const rows = await repo.find({
        count: { $gt: 10 },
      });
      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('Other Test');
    });
  });
});
