import { Optional, serializer, Integer, Required, properties, getProperties, Item, Enum } from '../src/lib/tschema';
import { PROPERTIES } from '../src/lib/common';
// import * as ajv from 'ajv';

class Yolo {

    @Optional()
    prop1: string;

    @Optional()
    @Integer()
    prop2: number;

    @Optional()
    prop3: Array<number>;

}

class Yolo2 extends Yolo {

    @Required()
    prop4 = true;

    @Optional()
    prop5: Yolo

}

class Yolo3 extends Yolo2 {
    @Optional()
    prop6: string;
}

class Item2 {
    @Required()
    foo: boolean;
}
class P {
    @Required()
    item: Item2;
    @Required()
    @Item(Item2)
    list: Item2[];
    @Optional()
    @Enum('gogo', 'popo')
    yo: 'gogo' | 'popo';
}

// Reflect.getMetadataKeys(Yolo2).forEach(x => console.log(Reflect.getMetadata(x, Yolo2)));

// const AJV = new ajv();
// console.log(serializer(Yolo2));
// console.log(Reflect.getMetadata(PROPERTIES, Yolo));
// console.log(properties(Yolo));
// console.log(properties(Yolo2));
// console.log(properties(Yolo3));
try {
    // console.log(getProperties(Yolo2).map(x => x.rules))
console.log(serializer(Yolo3));
console.dir(serializer(P), { depth: null });
} catch (e) { console.log(e) }

// import { Type } from '..';
// import { Entity } from './entity';
// import { KEY_PROPS } from './symbols';

// class TestA extends Entity {
//     @Type(String)
//     prop1: string;
// }

// class TestB {
//     @Type(Number)
//     prop2: number;
// }

// console.dir(Reflect.getOwnMetadata(KEY_PROPS, TestA), { depth: null });

// console.dir(Reflect.getOwnMetadata(KEY_PROPS, TestB), { depth: null });

// function Property(target: any, key: string) {
//     let t = Reflect.getMetadata('design:type', target, key);
//     console.log(`${key} type: ${t.name}`);
//     console.log(Reflect.getMetadataKeys(target, key))
//     const list = Reflect.getMetadata('toto', target.constructor) || [];
//     list.push({ key, type: t, yo: t === Yo });
//     Reflect.defineMetadata('toto', list, target.constructor);
// }

// class Yo {
//     @Property
//     prop: boolean;
// }

// console.dir(Reflect.getMetadata('toto', Yo), { depth: null });

// class Lo extends Yo {
//     @Property
//     prop1: number;

//     @Property
//     prop2: Yo;
// }


// console.dir(Reflect.getMetadata('toto', Lo), { depth: null });

// function Schema(target: any) {
//     console.log(Reflect.getMetadataKeys(target));
// }
// @Schema
// class Yolo {}
// console.log(Yolo);
