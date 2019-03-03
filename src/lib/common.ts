export const PROPERTIES     = Symbol('ts2jsc-properties');
export const TYPE           = Symbol('ts2jsc-type');
export const INTEGER        = Symbol('ts2jsc-integer');
export const REQUIRED       = Symbol('ts2jsc-required');

export const AnyClass = Function;

export interface AnyClass<T = object> extends Function {
  new (...args: any[]): T;
}

export function isAnyClass(v: any): v is AnyClass<any> {
  return typeof v === 'function';
}
