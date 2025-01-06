import { IObject } from "./object.js";

class IPin extends IObject {
    constructor({ uuid = crypto.randomUUID(), name = "IPin", outer = null, type = null, value = null } = {}) {

        super({ uuid, name, outer });

        this.value = value;

        this.type = type;

        this.subType = -1;
        this.validSubTypes = new Set([]);

        this.links = [];
        this.maxLinks = 1;

    }

    getNode() {
        return this.getOuter();
    }

    updateValue(value) {
        this.value = value;
    }

    isAnyLinked() {
        return this.links.length > 0;
    }
    isLinked(index = 0) {
        return this.getLink(index) ? true : false;
    }
    getLink(index) {
        return this.links[index];
    }
    getLinkNode(index) {
        const link = this.getLink(index);
        if(link) {
            return link.getOuter();
        }
    }
    canLinkTo(targetPin) {

        if(!targetPin || !targetPin.type || !targetPin.getOuter() || targetPin.type == this.type) {
            console.error("Invalid pin, type, or same pin type");
            return;
        }

        if(targetPin.getOuter() == this.getOuter()) {
            console.error("Source and target pins are the same");
            return;
        }

        if(!this.validSubTypes.has(targetPin.subType)) {
            console.error("Invalid sub pin type");
            return;
        }
        
        if(this.links.length >= this.maxLinks) {
            console.error("Link limit failed");
            return;
        };

        return true;

    }
    link(targetPin) {
        this.links.push(targetPin);
    }

    export() {

        let links = [];

        if(this.type !== IPin.TYPES.OUTPUT) {
            return links;
        }
        
        this.links.forEach(link => {

            if(!link || !link.getOuter() || !this.getOuter()) {
                return;
            }

            links.push({
                sourceNodeUUID: this.getOuter().getUUID(),
                sourcePinUUID: this.getUUID(),
                targetNodeUUID: link.getOuter().getUUID(),
                targetPinUUID: link.getUUID(),
                value: this.value
            });

        });

        return links;

    }

    
    static TYPES = {
        INPUT: 1,
        OUTPUT: 2
    }

    static SUB_TYPES = {
        EXEC: 1
    }


}


export { IPin };