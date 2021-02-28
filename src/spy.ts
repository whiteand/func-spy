import { getMetadata } from './getMetadata';
import { getSpiedStruct } from './getSpiedStruct';
import { getType } from './getType';
import { has } from './has';
import { mergeMetadata } from './mergeMetadata';
import { Type } from './Type';
import { IMetadata, ISpyResult, Path } from './types';

export function spy<T, U>(fn: (arg: T) => U, arg: T): ISpyResult<T, U> {
  const argT = getType(arg);
  const rootMetadata = getMetadata(arg);
  if ((argT & (Type.Object | Type.Array)) === 0) {
    const res = fn(arg);
    return {
      result: res,
      metadata: rootMetadata,
    };
  }
  const onMeet = (child: unknown, path: Path[]) => {
    let parent: any = rootMetadata;
    for (let i = 0; i < path.length - 1; i++) {
      parent = parent.children[path[i]];
    }
    const lastKey = path[path.length - 1];

    const childMetadata = getMetadata(child);
    childMetadata.path = path;
    parent.children[lastKey] = has(parent.children, lastKey)
      ? mergeMetadata(
          parent.children[lastKey] as IMetadata<unknown>,
          childMetadata
        )
      : childMetadata;
  };
  type ArgType = T extends object ? T : never;

  const spiedStruct = getSpiedStruct<ArgType>(arg as ArgType, onMeet);
  const r = fn(spiedStruct);
  return {
    result: r,
    metadata: rootMetadata,
  };
}
