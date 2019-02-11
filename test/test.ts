import { Property, Schema } from '../src/lib/tsjs';


@Schema
class Yolo {
    @Property
    prop1: string;
    @Property
    prop2: number;
    @Property
    prop3: Array<number>;
}

@Schema
class Yolo2 extends Yolo {
    @Property
    prop4 = true;
}

Reflect.getMetadataKeys(Yolo2).forEach(x => console.log(Reflect.getMetadata(x, Yolo2)));





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
