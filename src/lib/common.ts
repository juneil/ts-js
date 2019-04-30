export const PROPERTIES     = Symbol('tschema-properties');
export const TYPE           = Symbol('tschema-type');
export const INTEGER        = Symbol('tschema-integer');
export const REQUIRED       = Symbol('tschema-required');
export const ITEM           = Symbol('tschema-item');
export const ENUM           = Symbol('tschema-enum');

export const AnyClass = Function;

export interface AnyClass<T = object> extends Function {
  new (...args: any[]): T;
}

export function isAnyClass(v: any): v is AnyClass<any> {
  return typeof v === 'function';
}
