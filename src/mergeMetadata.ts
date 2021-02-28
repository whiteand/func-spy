import { has } from './has';
import { Type } from './Type';
import { Bitmask, IMetadata } from './types';

export function mergeMetadata<T>(
  prev: IMetadata<T>,
  cur: IMetadata<T>
): IMetadata<T> {
  const newChildren = Object.fromEntries(
    Object.entries(prev.children).map(([k, m]) => {
      if (has(cur.children, k)) {
        const newChildM: typeof m = (cur.children as any)[k];
        return [
          k,
          mergeMetadata(
            m as IMetadata<unknown>,
            newChildM as IMetadata<unknown>
          ),
        ];
      }
      return [k, m];
    })
  );
  for (const [k, m] of Object.entries(cur.children)) {
    if (has(newChildren, k)) continue;
    (newChildren as any)[k] = m;
  }
  const newData = [...prev.data, ...cur.data];
  const newType = prev.type | cur.type;
  return {
    children: newChildren as any,
    data: newData,
    path: prev.path,
    type: newType as Bitmask<Type>,
  };
}
