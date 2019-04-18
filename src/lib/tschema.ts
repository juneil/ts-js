import 'reflect-metadata';
import { JSONSchemaDraft07 } from './drafts/draft-07';
import { TYPE, INTEGER, REQUIRED, PROPERTIES, AnyClass } from './common';
export type ClassProperty = { key: string, rules: { rule: Symbol, value: any }[] };

/**
 * Integer decorator
 */
function integerDecorator() {
    return (target: any, key: string) => {
        addRule(target, key, INTEGER, null);
    }
}

/**
 * Required decorator
 */
function requiredDecorator() {
    return (target: any, key: string) => {
        propertyDecorator()(target, key);
        addRule(target, key, REQUIRED, null);
    }
}

/**
 * Called by the @Property decorator
 * Add the property type in the class metadata
 */
function propertyDecorator() {
    return (target: any, key: string) => {
        let type = Reflect.getMetadata('design:type', target, key);
        if (type === Object) {
            const instance = Reflect.construct(target.constructor, []);
            if (instance[key] instanceof Array) {
                type = Array;
            } else {
                type = serializeType(typeof instance[key]);
            }
        }
        addRule(target, key, TYPE, type);
    }
}

function addRule(target, key: string, rule: Symbol, value) {
    const props: ClassProperty[] = Reflect.getOwnMetadata(PROPERTIES, target.constructor) || [];
    const prop = props.find(p => p.key === key);
    if (prop && !prop.rules.find(r => r.rule === rule)) {
        prop.rules.push({ rule, value });
    } else {
        props.push({ key, rules: [{ rule, value }] })
    }
    Reflect.defineMetadata(PROPERTIES, props, target.constructor);
}

function serializeType(type: string) {
    switch (type) {
        case 'number':
            return Number;
        case 'string':
            return String;
        case 'boolean':
            return Boolean;
        case 'undefined':
            return undefined;
        case 'function':
            return Function;
        default:
            return Object;
    }
}

export function getProperties(target: AnyClass): ClassProperty[] {
    const parent = Reflect.getPrototypeOf(target);
    let props: ClassProperty[] = Reflect.getOwnMetadata(PROPERTIES, target);
    if (parent['name']) {
        props = [].concat(props, getProperties(parent as any))
    }
    return props;
}

function serialize(target: any) {
    const jsc = new JSONSchemaDraft07(target.name, getProperties(target));
    return jsc.toJSONSchema();
}

function containsProperties(token: AnyClass): boolean {
    return token && !!Reflect.getOwnMetadataKeys(token).find(t => t === PROPERTIES);
}

function propertiesList(token: AnyClass): { [prop: string]: Object | String | Number | Boolean | Function | undefined } {
    return getProperties(token)
        .map(prop => ({ ...(prop.rules || []).find(rule => rule.rule === TYPE), key: prop.key }))
        .reduce((a, c) => {
            a[c.key] = c.value;
            return a;
        }, {});
}

export const Optional = propertyDecorator;
export const Required = requiredDecorator;
export const Integer = integerDecorator;
export const isTSchema = containsProperties;
export const serializer = serialize;
export const properties = propertiesList;
