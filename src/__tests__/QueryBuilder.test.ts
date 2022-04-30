import { DatabaseMetadata, NotionDatabase } from '../internal/types';
import { buildQuery } from '../QueryBuilder';
import { BaseEntity } from '../types';

interface Entity extends BaseEntity {
  is_checked: boolean;
  name: string;
  state: string;
  ttl: number;
}

function expectFilter(actual: any, expected: any) {
  expect(actual.filter.and).toEqual(expected);
}

describe('QueryBuilder', () => {
  const mockDatabase: NotionDatabase = {
    id: 'ijkl-mnop',
    parent: { type: 'workspace', workspace: true },
    properties: {
      // @ts-ignore
      is_checked: {
        id: 'foo',
        checkbox: {},
        type: 'checkbox',
      },
      // @ts-ignore
      name: {
        id: 'bar',
        rich_text: {},
        type: 'rich_text',
      },
      // @ts-ignore
      state: {
        id: 'baz',
        select: { options: [] },
        type: 'select',
      },
      // @ts-ignore
      ttl: {
        id: 'qux',
        number: { format: 'real' },
        type: 'number',
      },
    },
  };
  const mockMetadata: DatabaseMetadata = {
    id: 'abcd-efgh',
    propertiesMap: {},
  };

  describe('empty', () => {
    it('works when provided no filters', () => {
      const query = buildQuery<Entity>(mockDatabase, mockMetadata);
      expect(query).not.toHaveProperty('filter');
    });

    it('works when provided empty filter object', () => {
      const query = buildQuery<Entity>(mockDatabase, mockMetadata, {});
      expect(query).not.toHaveProperty('filter');
    });

    it('works when provided undefined filter value', () => {
      const query = buildQuery<Entity>(mockDatabase, mockMetadata, { name: undefined });
      expect(query).not.toHaveProperty('filter');
    });
  });

  describe('booleans', () => {
    it('can $eq', () => {
      const query = buildQuery<Entity>(mockDatabase, mockMetadata, {
        is_checked: { $eq: true },
      });

      expectFilter(query, [
        { checkbox: { equals: true }, property: 'is_checked', type: 'checkbox' },
      ]);
    });
  });

  describe('numbers', () => {
    it('can $lt', () => {
      const query = buildQuery<Entity>(mockDatabase, mockMetadata, {
        ttl: { $lt: 42 },
      });

      expectFilter(query, [{ number: { less_than: 42 }, property: 'ttl', type: 'number' }]);
    });
  });

  describe('select', () => {
    it('can $eq', () => {
      const query = buildQuery<Entity>(mockDatabase, mockMetadata, {
        state: { $eq: 'foobar' },
      });

      expectFilter(query, [{ select: { equals: 'foobar' }, property: 'state', type: 'select' }]);
    });
  });

  describe('text', () => {
    it('can $eq', () => {
      const query = buildQuery<Entity>(mockDatabase, mockMetadata, {
        name: { $eq: 'foobar' },
      });

      expectFilter(query, [
        { rich_text: { equals: 'foobar' }, property: 'name', type: 'rich_text' },
      ]);
    });
  });

  describe('validation', () => {
    it('throws when filtering on property that does not exist', () => {
      expect(() =>
        buildQuery<any>(mockDatabase, mockMetadata, { __null__: { $eq: 'foobar' } }),
      ).toThrow();
    });
  });
});
