import { Path } from './types';

export function has<K extends Path>(
  obj: unknown,
  k: K
): obj is Record<K, unknown> {
  if (!obj) return false;
  return Object.prototype.hasOwnProperty.call(obj, k);
}
