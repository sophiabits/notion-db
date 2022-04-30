import { Connection } from '../Connection';
import { Repository } from '../Repository';

describe('Connection', () => {
  it('throws when provided invalid token', async () => {
    await expect(Connection.withToken('asdassadasdsa')).rejects.toThrow();
  });

  it('builds database map', async () => {
    const conn = await Connection.withToken(process.env.NOTION_TOKEN!);
    const dbs = (conn as any).dbs;

    const meta = dbs.get('db map test');
    expect(meta).toBeDefined();

    expect(meta.id).toBe('35f832d6-70b4-40a1-8f80-376f0f267aab');
    expect(meta.propertiesMap).toEqual({
      name: 'Name',
      withSpace: 'With Space',
    });
  });

  it('#database throws when provided unrecognized database name', async () => {
    const conn = await Connection.withToken(process.env.NOTION_TOKEN!);
    expect(() => conn.database('__foo_bar_baz__')).toThrow();
  });

  it('#database returns a repository', async () => {
    const conn = await Connection.withToken(process.env.NOTION_TOKEN!);
    const repo = conn.database('db map test');
    expect(repo).toBeInstanceOf(Repository);
  });
});
