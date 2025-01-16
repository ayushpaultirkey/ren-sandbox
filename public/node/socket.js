import { IObject } from "./object.js";

class ISocket extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.Socket",
        displayName: "Socket",
        displayColor: "gray"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = null, type = null, value = null } = {}) {

        super({ uuid, outer, name });

        this.value = value;

        this.type = type;
        this.subType = -1;
        this.validSubTypes = new Set([]);

        this.links = [];
        this.maxLinks = 1;

    }

    getValue() {
        if(this.type == ISocket.TYPES.INPUT) {

            const link = this.links[0];
            if(!link) return null;

            const node = link.getNode();
            if(!node) return null;

            if(!node.getMeta().canCache) {
                node.execute();
            }

            return link.getValue();

        }
        else {
            return this.value;
        }
    }
    getValues() {
        if(this.type == ISocket.TYPES.INPUT) {

            const values = [];

            this.links.forEach(link => {
                if(link) {

                    const value = link.getValue();
                    if(!value) return;

                    values.push(value);
                    
                }
            });

            return values;
        }
        else {
            return this.value;
        }
    }
    setValue(value) {
        if(this.type == ISocket.TYPES.INPUT) {
            console.error("Cannot set input value");
            return;
        }
        this.value = value;
    }


    getNode() {
        return this.outer;
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
    getLinkedNode(index) {
        const link = this.getLink(index);
        if(link) {
            return link.outer;
        }
    }


    canLinkTo(targetSocket) {

        if(!targetSocket || !targetSocket.type || !targetSocket.outer || targetSocket.type == this.type) {
            console.error("Invalid socket, type, or same socket type");
            return;
        }

        if(targetSocket.outer == this.outer) {
            console.error("Source and target sockets are the same");
            return;
        }

        if(this.type == ISocket.TYPES.INPUT && !this.validSubTypes.has(targetSocket.subType)) {
            console.error("Invalid sub-socket type");
            return;
        }
        
        if(this.links.length >= this.maxLinks) {
            console.error("Link limit failed");
            return;
        };

        return true;

    }
    link(targetSocket) {
        this.links.push(targetSocket);
    }
    unlink(targetSocket) {
        this.links = this.links.filter(link => link != targetSocket);
    }
    unlinkAll() {
        this.links = [];
    }


    export() {

        let links = [];

        if(this.type !== ISocket.TYPES.OUTPUT) {
            return links;
        }
        
        this.links.forEach(link => {

            if(!link || !link.outer || !this.outer) {
                return;
            }

            links.push({
                sourceNodeUUID: this.getNode().getUUID(),
                sourceSocketUUID: this.getUUID(),
                targetNodeUUID: link.getNode().getUUID(),
                targetSocketUUID: link.getUUID()
            });

        });

        return links;

    }

    
    static TYPES = {
        INPUT: 1,
        OUTPUT: 2
    }

}


export { ISocket };