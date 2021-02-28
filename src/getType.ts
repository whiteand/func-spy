import { Type } from './Type';

export function getType(value: unknown): Type {
  if (value === null) return Type.Null;
  if (value === undefined) return Type.Undefined;
  switch (typeof value) {
    case 'number':
      return Type.Number;
    case 'boolean':
      return Type.Boolean;
    case 'function':
      return Type.Function;
    case 'string':
      return Type.String;
    case 'object':
      if (Array.isArray(value)) return Type.Array;
      if (value instanceof Date) return Type.Date;
      return Type.Object;
    default:
      throw new Error('cannot find typeof value');
  }
}
