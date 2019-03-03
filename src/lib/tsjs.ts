import 'reflect-metadata';
import { JSONSchemaDraft07 } from './drafts/draft-07';
import { TYPE, INTEGER, REQUIRED, PROPERTIES } from './common';
export type ClassProperty = { key: string, rules: { rule: Symbol, value: any }[] };

// const schemaSymbol = Symbol('ts2jsc-schema');

/**
 * Called by the @Schema decorator
 * Initialize the metadata of the class
 */
// function schemaClass(target: any) {
//     const metadata = {};
//     Reflect.defineMetadata(schemaSymbol, metadata, target);
// }

function integerDecorator() {
    return (target: any, key: string) => {
        addRule(target, key, INTEGER, null);
    }
}

function requiredDecorator() {
    return (target: any, key: string) => {
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
        // if (hasMetadata(type)) {

        // }
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
    const properties: ClassProperty[] = Reflect.getMetadata(PROPERTIES, target.constructor) || [];
    const prop = properties.find(p => p.key === key);
    if (prop) {
        prop.rules.push({ rule, value });
    } else {
        properties.push({ key, rules: [{ rule, value }] })
    }
    Reflect.defineMetadata(PROPERTIES, properties, target.constructor);
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

function serialize(target: any) {
    const jsc = new JSONSchemaDraft07(target.name, Reflect.getMetadata(PROPERTIES, target));
    return jsc.toJSONSchema();
}

// export const Schema = schemaClass;
export const Property = propertyDecorator;
export const Integer = integerDecorator;
export const Required = requiredDecorator;

export const serializer = serialize;
