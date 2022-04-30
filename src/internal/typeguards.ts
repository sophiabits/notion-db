import _ from 'lodash';

import type { NotionDatabase } from './types';

export function assert(x: boolean): asserts x {
  if (!x) {
    throw new Error('Assertion failed');
  }
}

export function isNotionDatabase(x: unknown): x is NotionDatabase {
  return (
    typeof x === 'object' &&
    !!x &&
    'id' in x &&
    'object' in x &&
    'title' in x &&
    // FIXME: `'object' in x` doesn't type narrow here?
    _.get(x, 'object') === 'database'
  );
}
