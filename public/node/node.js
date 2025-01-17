import { IObject } from "./object.js";
import { ISocket } from "./socket.js";
import { IPropertyManager } from "./property/manager.js";
import { IProperty } from "./property.js";

class INode extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.INode",
        displayName: "Node",
        canCache: true
    }

    /** @type {IPropertyManager} */
    #propertyManager = null;

    constructor({ uuid = crypto.randomUUID(), outer = null } = {}) {

        super({ uuid, outer });

        /** @type {Object.<string, ISocket>} */
        this.inputs = {};

        /** @type {Object.<string, ISocket>} */
        this.outputs = {};
        
        /** @type {Object.<string, IProperty>} */
        this.properties = {};
        this.custom = {};

        this.isEntry = false;

        this.#propertyManager = new IPropertyManager({ outer: this });

    }

    get propertyManager() {
        return this.#propertyManager;
    }

    main({ properties = {}, custom = {} } = {}) {
        try {
            if(custom) {
                this.custom = custom;
            }
            for(const uuid in properties) {
                const property = properties[uuid];
                this.#propertyManager.setProperty(uuid, property.value);
            }
            return true;
        }
        catch(error) {
            console.error(error);
        }
    }
    
    addInputSocket(uuid, name, socketClass) {
        
        if(!socketClass) return null;
        if(this.inputs[uuid]) return null;

        const socket = new socketClass({
            uuid: uuid,
            outer: this,
            name: name,
            type: ISocket.TYPES.INPUT
        });
        this.inputs[uuid] = socket;

        return socket;

    }
    addOutputSocket(uuid, name, socketClass) {

        if(!socketClass) return null;
        if(this.outputs[uuid]) return null;

        const socket = new socketClass({
            uuid: uuid,
            outer: this,
            name: name,
            type: ISocket.TYPES.OUTPUT
        });
        this.outputs[uuid] = socket;

        return socket;
        
    }

    getInputSocket(uuid) {
        return this.inputs[uuid];
    }
    getOutputSocket(uuid) {
        return this.outputs[uuid];
    }
    getSocket(uuid) {
        return this.getInputSocket(uuid) || this.getOutputSocket(uuid);
    }


    execute() {}
    executeLinkedNode(socketUUID, linkIndex = 0) {

        const socket = this.getSocket(socketUUID);

        if(socket && socket.isLinked(linkIndex)) {
            const node = socket.getLinkedNode(linkIndex);
            if(node) {
                node.execute();
            }
        }

    }


    customExport() { return null; }
    export() {
        
        const data = {
            data: {
                class: this.meta.className,
                properties: this.#propertyManager.export(),
                custom: this.custom
            },
            links: []
        };

        let links = [];
        for(const uuid in this.outputs) {
            const socket = this.outputs[uuid];
            links = links.concat(socket.export());   
        }
        data.links = links;

        return data;

    }

}

const REGISTERED_NODES = new Map();
const NODES_REGISTRY = {
    register: function(classId, nodeClass) {
        REGISTERED_NODES.set(classId, nodeClass);
    },
    registerMany: function(nodes = {}) {
        for(const classId in nodes) {
            this.register(classId, nodes[classId]);
        }
    },
    unregister: function(classId) {
        return REGISTERED_NODES.delete(classId);
    },
    get: function(classId) {
        return REGISTERED_NODES.get(classId);
    },
    getAll: function() {
        return REGISTERED_NODES.entries();
    },
    isRegistered: function(classId) {
        return REGISTERED_NODES.has(classId);
    },
};

export { INode, NODES_REGISTRY };