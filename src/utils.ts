import { Type } from './Type';
import { IMetadata } from './types';

export function iterate<T, R>(
  iter: (metadata: IMetadata<any>, root: IMetadata<T>) => R,
  val: IMetadata<T>
): R;
export function iterate<T>(
  iter: (metadata: IMetadata<any>, root: IMetadata<T>) => void,
  val: IMetadata<T>
): void;
export function iterate(
  iter: (metadata: IMetadata<any>, root: IMetadata<any>) => void,
  val: IMetadata<any> | null | undefined
): any {
  if (!val) return;
  const stack = [val];
  while (stack.length > 0) {
    const metadata = stack.pop();
    if (!metadata) continue;
    const r = iter(metadata, val);
    if (r !== undefined) {
      return r;
    }
    if (!val.children) continue;
    for (const child of Object.values(val.children)) {
      if (!child || child.type == null) continue;
      stack.push(child);
    }
  }
}

type StringType =
  | 'undefined'
  | 'null'
  | 'boolean'
  | 'number'
  | 'string'
  | 'array'
  | 'object'
  | 'function'
  | 'symbol'
  | 'bigint'
  | 'date';
/**
 * @param type bitmask from IMetadata
 */
export function typeToStringTypes(type: number): StringType[] {
  const res: StringType[] = [];

  if (type & Type.Undefined) res.push('undefined');
  if (type & Type.Null) res.push('null');
  if (type & Type.Boolean) res.push('boolean');
  if (type & Type.Number) res.push('number');
  if (type & Type.String) res.push('string');
  if (type & Type.Array) res.push('array');
  if (type & Type.Object) res.push('object');
  if (type & Type.Function) res.push('function');
  if (type & Type.Symbol) res.push('symbol');
  if (type & Type.Bigint) res.push('bigint');
  if (type & Type.Date) res.push('date');

  return res;
}
