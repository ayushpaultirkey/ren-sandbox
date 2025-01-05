import { IObject } from "./object.js";

class IPin extends IObject {
    constructor({ name, outer, type, value }) {

        super({ name, outer });

        this.value = value || null;

        this.type = type || null;
        this.validTypes = new Set([]);

        this.links = [];
        this.maxLinks = 1;

    }
    static TYPE = {
        INPUT: 1,
        OUTPUT: 2
    }
    updateValue(value) {
        
        this.value = value;

    }
    isAnyLinked() {
        return this.links.length > 0;
    }
    isLinked(index = 0) {
        return this.links[index];
    }
    getLink(index) {
        if(this.links[index]) {
            return this.links[index];
        }
    }
    canLinkTo(targetPin) {

        if(!targetPin || !targetPin.type || !targetPin.getOuter() || targetPin.type == this.type) {
            console.error("Invalid pin");
            return;
        }

        // if(!this.validTypes.has(targetPin.type)) {
        //     console.error("Invalid pin type");
        //     return;
        // }
        
        if(this.links.length >= this.maxLinks) {
            console.error("Link limit failed");
            return;
        };

        return true;

    }
    link(targetPin) {
        this.links.push(targetPin);
    }
}


export { IPin };