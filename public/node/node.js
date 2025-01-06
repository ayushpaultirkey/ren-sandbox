import { IObject } from "./object.js";
import { IPin } from "./pin.js";

class INode extends IObject {

    constructor({ uuid = crypto.randomUUID(), name = "INode", outer = null } = {}) {
        super({ uuid, name, outer });
        this.in = {};
        this.out = {};
        this.isEntry = false;
    }
    
    addInputPin(pinUUID, pinClass, pinSubType) {
        
        if(!pinClass) return null;
        if(this.in[pinUUID]) return null;

        const pin = new pinClass({ uuid: pinUUID, outer: this, type: IPin.TYPES.INPUT, subType: pinSubType });
        this.in[pinUUID] = pin;

        return pin;

    }
    addOutputPin(pinUUID, pinClass, pinSubType) {

        if(!pinClass) return null;
        if(this.out[pinUUID]) return null;

        const pin = new pinClass({ uuid: pinUUID, outer: this, type: IPin.TYPES.OUTPUT, subType: pinSubType });
        this.out[pinUUID] = pin;

        return pin;
        
    }

    getPin(pinUUID) {
        return this.getInputPin(pinUUID) || this.getOutputPin(pinUUID);
    }
    getInputPin(pinUUID) {
        return this.in[pinUUID];
    }
    getOutputPin(pinUUID) {
        return this.out[pinUUID];
    }

    execute() {

    }
    executeLinkedNode(pinUUID, pinIndex = 0) {

        const pin = this.getPin(pinUUID);

        if(pin && pin.isLinked(pinIndex)) {
            pin.getLinkNode(pinIndex).execute();
        }

    }

    export() {
        
        let links = [];

        for(const pinUUID in this.out) {
            const pin = this.out[pinUUID];
            links = links.concat(pin.export());
        }

        return {
            data: {
                class: this.constructor.name
            },
            links: links
        };

    }

}


export { INode };