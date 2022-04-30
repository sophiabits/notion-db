import { DatabaseMetadata, NotionDatabase } from '../internal/types';
import { buildQuery } from '../QueryBuilder';
import { BaseEntity } from '../types';

interface Entity extends BaseEntity {
  isChecked: boolean;
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
      'Is Checked': {
        id: 'foo',
        checkbox: {},
        type: 'checkbox',
      },
      // @ts-ignore
      Name: {
        id: 'bar',
        rich_text: {},
        type: 'rich_text',
      },
      // @ts-ignore
      State: {
        id: 'baz',
        select: { options: [] },
        type: 'select',
      },
      // @ts-ignore
      TTL: {
        id: 'qux',
        number: { format: 'real' },
        type: 'number',
      },
    },
  };
  const mockMetadata: DatabaseMetadata = {
    id: 'abcd-efgh',
    propertiesMap: {
      isChecked: 'Is Checked',
      name: 'Name',
      state: 'State',
      ttl: 'TTL',
    },
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
        isChecked: { $eq: true },
      });

      expectFilter(query, [
        { checkbox: { equals: true }, property: 'Is Checked', type: 'checkbox' },
      ]);
    });
  });

  describe('numbers', () => {
    it('can $lt', () => {
      const query = buildQuery<Entity>(mockDatabase, mockMetadata, {
        ttl: { $lt: 42 },
      });

      expectFilter(query, [{ number: { less_than: 42 }, property: 'TTL', type: 'number' }]);
    });
  });

  describe('select', () => {
    it('can $eq', () => {
      const query = buildQuery<Entity>(mockDatabase, mockMetadata, {
        state: { $eq: 'foobar' },
      });

      expectFilter(query, [{ select: { equals: 'foobar' }, property: 'State', type: 'select' }]);
    });
  });

  describe('text', () => {
    it('can $eq', () => {
      const query = buildQuery<Entity>(mockDatabase, mockMetadata, {
        name: { $eq: 'foobar' },
      });

      expectFilter(query, [
        { rich_text: { equals: 'foobar' }, property: 'Name', type: 'rich_text' },
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
