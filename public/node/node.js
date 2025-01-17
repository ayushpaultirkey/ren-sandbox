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

        this.value = {};

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
            for(const name in properties) {
                const property = properties[name];
                this.#propertyManager.setProperty(name, property.value);
            }
            return true;
        }
        catch(error) {
            console.error(error);
        }
    }
    
    setValues(values) {
        for(const valueUUID in values) {

            const value = values[valueUUID];

            const valueField = this.value[valueUUID];
            if(!valueField) continue;
            
            valueField.setValue(value);

        }
    }
    
    addInputSocket(socketUUID, socketName, socketClass) {
        
        if(!socketClass) return null;
        if(this.inputs[socketUUID]) return null;

        const socket = new socketClass({
            uuid: socketUUID,
            outer: this,
            name: socketName,
            type: ISocket.TYPES.INPUT
        });
        this.inputs[socketUUID] = socket;
        
        return socket;

    }
    addOutputSocket(socketUUID, socketName, socketClass) {

        if(!socketClass) return null;
        if(this.outputs[socketUUID]) return null;

        const socket = new socketClass({
            uuid: socketUUID,
            outer: this,
            name: socketName,
            type: ISocket.TYPES.OUTPUT
        });
        this.outputs[socketUUID] = socket;

        return socket;
        
    }

    getInputSocket(socketUUID) {
        return this.inputs[socketUUID];
    }
    getOutputSocket(socketUUID) {
        return this.outputs[socketUUID];
    }
    getSocket(socketUUID) {
        return this.getInputSocket(socketUUID) || this.getOutputSocket(socketUUID);
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