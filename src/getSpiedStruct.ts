import { getType } from './getType';
import { Type } from './Type';
import { Path } from './types';

export function getSpiedStruct<T extends object>(
  obj: T,
  onMeet: (value: unknown, path: Path[]) => void
): T {
  const proxy: T = new Proxy<T>(obj, {
    get(t: T, k: string | symbol | number) {
      const child = t[k as keyof T];
      const childT = getType(child);
      onMeet(child, [k]);
      if (childT & (Type.Object | Type.Array)) {
        return getSpiedStruct(
          (child as unknown) as object,
          (subChild, subPath) => {
            onMeet(subChild, [k, ...subPath]);
          }
        );
      }
      if (childT & Type.Function) {
        return ((child as unknown) as Function).bind(proxy);
      }
      return child;
    },
  });
  return proxy;
}
