import { getType } from './getType';
import { Type } from './Type';
import { IMetadata, Bitmask } from './types';

export function getMetadata<V>(arg: V): IMetadata<V> {
  return {
    children: Object.create(null) as IMetadata<V>['children'],
    data: [arg],
    path: [],
    type: getType(arg) as Bitmask<Type>,
  };
}
