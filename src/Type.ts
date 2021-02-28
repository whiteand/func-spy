export enum Type {
  Undefined = 1 << 0,
  Null = 1 << 1,
  Boolean = 1 << 2,
  Number = 1 << 3,
  String = 1 << 4,
  Array = 1 << 5,
  Object = 1 << 6,
  Function = 1 << 7,
  Symbol = 1 << 8,
  Bigint = 1 << 9,
  Date = 1 << 10,
}
