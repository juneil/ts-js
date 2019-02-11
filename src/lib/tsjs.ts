import 'reflect-metadata';

const schemaSymbol = Symbol('tsjs-schema');
const propsSymbol = Symbol('tsjs-properties');

type ClassProperty = { key: string, type: any };

/**
 * Called by the @Schema decorator
 * Initialize the metadata of the class
 */
function schemaClass(target: any) {
    const metadata = {};
    Reflect.defineMetadata(schemaSymbol, metadata, target);
}

/**
 * Called by the @Property decorator
 * Add the property type in the class metadata
 */
function propertyDecorator(target: any, key: string) {
    const props: ClassProperty[] = Reflect.getMetadata(propsSymbol, target.constructor) || [];
    let type = Reflect.getMetadata('design:type', target, key);
    if (type === Object) {
        const instance = Reflect.construct(target.constructor, []);
        if (instance[key] instanceof Array) {
            type = Array;
        } else {
            type = serializeType(typeof instance[key]);
        }
    }
    props.push({ key, type });
    Reflect.defineMetadata(propsSymbol, props, target.constructor);
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

export const Schema = schemaClass;
export const Property = propertyDecorator;
