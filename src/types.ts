import { Type } from './Type';

export type Path = string | number | symbol;

export declare const bit: unique symbol;

export type Bitmask<Bit> = number & { bit: Bit };

export interface IMetadata<T> {
  children: T extends object
    ? {
        [k in keyof T]?: IMetadata<T[k]>;
      }
    : {};
  data: T[];
  path: Path[];
  type: Bitmask<Type>;
}

export interface ISpyResult<T, U> {
  result: U;
  metadata: IMetadata<T>;
}
