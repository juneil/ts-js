import { ClassProperty } from '../tsjs';
import { TYPE, INTEGER, REQUIRED, AnyClass, isAnyClass, PROPERTIES } from '../common';

interface Context {
    definitions: AnyClass[]
}

export class JSONSchemaDraft07 {

    private schema = 'http://json-schema.org/draft-07/schema#';
    private id = '';

    constructor(
        private name: string,
        private properties: ClassProperty[]
    ) {
        this.id = `http://ts2jsc.com/${this.name.toLowerCase()}.json`;
    }

    private serializeProperties(properties: ClassProperty[], ctx) {
        return properties
            .map(property => this.type(property, ctx))
            .reduce((a, property) => ({ ...a, [property.key]: property.result }), {});
    }

    private serializeRequired(properties: ClassProperty[]) {
        return properties
            .filter(p => this.required(p))
            .map(p => p.key);
    }

    private hasMetadata(classToCheck: AnyClass): boolean {
        return isAnyClass(classToCheck) && !!Reflect.getMetadata(PROPERTIES, classToCheck);
    }

    public toJSONSchema(root = true) {
        const ctx: Context = {
            definitions: []
        };
        const json = {
            title: this.name,
            description: 'JSON Schema generated from TS2JSC',
            type: 'object',
            properties: this.serializeProperties(this.properties, ctx),
            required: this.serializeRequired(this.properties),
            definitions: this.definitions(ctx.definitions)
        };
        if (root) {
            return {
                $schema: this.schema,
                $id: this.id,
                ...json
            }
        }
        return {
            $id: `${this.name.toLowerCase()}.json`,
            ...json
        }
    }

    private type(property: ClassProperty, ctx) {
        const rule = property.rules.find(r => r.rule === TYPE);
        switch (rule.value) {
            case Number:
                return { ...property, result: { type: this.integer(property) ? 'integer' : 'number' } };
            case String:
                return { ...property, result: { type: 'string' } };
            case Boolean:
                return { ...property, result: { type: 'boolean' } };
            case Array:
                return { ...property, result: { type: 'array' } };
            case undefined:
                return { ...property, result: { type: 'null' } };
            default:
                if (this.hasMetadata(rule.value)) {
                    ctx.definitions = ctx.definitions || [];
                    ctx.definitions.push(rule.value);
                    return { ...property, result: { $ref: `${this.id}/definitions/${rule.value.name.toLowerCase()}` } }
                }
                return { ...property, result: { type: 'object' } };
        }
    }

    private integer(property: ClassProperty) {
        const rule = property.rules.find(r => r.rule === INTEGER);
        return !!rule;
    }

    private required(property: ClassProperty) {
        const rule = property.rules.find(r => r.rule === REQUIRED);
        return !!rule;
    }

    private definitions(schemas: AnyClass[]) {
        return schemas
            .map(schema => new JSONSchemaDraft07(schema.name.toLowerCase(), Reflect.getMetadata(PROPERTIES, schema))
                .toJSONSchema(false))
            .reduce((a, c) => a[c.name] = c, {});
    }
}