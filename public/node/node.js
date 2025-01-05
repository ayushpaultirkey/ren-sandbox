import { IObject } from "./object.js";
import { IPin } from "./pin.js";

class INode extends IObject {
    constructor({ uuid, name, outer }) {
        super({ uuid, name, outer });
        this.in = {};
        this.out = {};
    }
    addInputPin(pinName, pinClass) {

        if(!pinClass) return null;
        if(this.in[pinName]) return null;

        const pin = new pinClass({ outer: this, type: IPin.TYPE.INPUT });
        this.in[pinName] = pin;

        return pin;

    }
    addOutputPin(pinName, pinClass) {

        if(!pinClass) return null;
        if(this.out[pinName]) return null;

        const pin = new pinClass({ outer: this, type: IPin.TYPE.OUTPUT });
        this.outer[pinName] = pin;
        
        return pin;

    }
    getInputPin(pinName) {
        return this.in[pinName];
    }
    getOutputPin(pinName) {
        return this.out[pinName];
    }
    execute() {

    }
}


export { INode };