import { INode } from "./node.js";
import { IObject } from "./object.js";

class ISocket extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.Socket",
        displayName: "Socket",
        displayColor: "gray"
    }

    /** @type {ISocket[]} */
    #links = [];
    get links() {
        return this.#links;
    }

    #type = null;
    get type() {
        return this.#type;
    }

    #isRuntime = false;
    get isRuntime() {
        return this.#isRuntime;
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = null, type = null, isRuntime = false } = {}) {

        super({ uuid, outer, name });

        this.#type = type;
        this.#links = [];
        this.#isRuntime = isRuntime;

        this.subType = -1;
        this.validSubTypes = new Set([]);
    
        this.maxLinks = 1;

    }

    #value = null;
    getValue() {
        if(this.#type == ISocket.TYPES.INPUT) {

            const link = this.#links[0];
            if(!link) return null;

            const node = link.getNode();
            if(!node) return null;

            if(!node.meta.canCache) {
                node.execute();
            }

            return link.getValue();

        }
        else {
            return this.#value;
        }
    }
    getValues() {
        if(this.#type == ISocket.TYPES.INPUT) {

            const values = [];

            this.#links.forEach(link => {
                if(link) {

                    const value = link.getValue();
                    if(!value) return;

                    values.push(value);
                    
                }
            });

            return values;
        }
        else {
            return [this.#value];
        }
    }
    setValue(value) {
        if(this.#type == ISocket.TYPES.INPUT) {
            console.error("Cannot set input value");
            return;
        };
        this.#value = value;
    }

    /** @returns {INode} */
    getNode() {
        return this.outer;
    }


    isAnyLinked() {
        return this.#links.length > 0;
    }
    isLinked(index = 0) {
        return this.getLink(index) ? true : false;
    }
    getLink(index) {
        return this.#links[index];
    }
    getLinkedNode(index) {
        const link = this.getLink(index);
        return link ? link.outer : null;
    }


    canLinkTo(targetSocket) {

        if(!targetSocket || !targetSocket.type || !targetSocket.outer || targetSocket.type == this.#type) {
            console.error("Invalid socket, type, or same socket type");
            return;
        }

        if(targetSocket.outer == this.outer) {
            console.error("Source and target sockets are the same");
            return;
        }

        if(this.#type == ISocket.TYPES.INPUT && !this.validSubTypes.has(targetSocket.subType)) {
            console.error("Invalid sub-socket type");
            return;
        }
        
        if(this.#links.length >= this.maxLinks) {
            console.error("Link limit failed");
            return;
        };

        return true;

    }
    link(targetSocket) {
        this.#links.push(targetSocket);
    }
    unlink(targetSocket) {
        this.#links = this.#links.filter(link => link != targetSocket);
    }
    clear() {
        this.#links = [];
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
                sourceNode: this.outer.uuid,
                sourceSocket: this.uuid,
                targetNode: link.outer.uuid,
                targetSocket: link.uuid
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