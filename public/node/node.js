import { IObject } from "./object.js";
import { ISocket } from "./socket.js";
import { IPropertyManager } from "./property/manager.js";

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

        this.inputs = {};
        this.outputs = {};
        this.properties = {};

        this.isEntry = false;

        this.#propertyManager = new IPropertyManager({ outer: this });

    }

    main({ properties = {} } = {}) {
        try {
            this.#propertyManager.main(properties);
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
    
    addInputSocket(socketUUID, socketClass, socketSubType) {
        
        if(!socketClass) return null;
        if(this.inputs[socketUUID]) return null;

        const socket = new socketClass({ uuid: socketUUID, outer: this, type: ISocket.TYPES.INPUT, subType: socketSubType });
        this.inputs[socketUUID] = socket;

        return socket;

    }
    addOutputSocket(socketUUID, socketClass, socketSubType) {

        if(!socketClass) return null;
        if(this.outputs[socketUUID]) return null;

        const socket = new socketClass({ uuid: socketUUID, outer: this, type: ISocket.TYPES.OUTPUT, subType: socketSubType });
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
        
        let links = [];
        let values = {};

        for(const socketUUID in this.outputs) {
            const socket = this.outputs[socketUUID];
            links = links.concat(socket.export());
        }

        for(const valueUUID in this.value) {
            const value = this.value[valueUUID];
            values[valueUUID] = value.getValue();
        }

        return {
            data: {
                class: this.getMeta().className, ... this.customExport(),
                value: values
            },
            links: links
        };

    }

}

const REGISTERED_NODES = {};
const NODES_REGISTRY = {
    register: function(classId, nodeClass) {
        REGISTERED_NODES[classId] = nodeClass;
    },
    registerMany: function(nodes = {}) {
        for(const classId in nodes) {
            this.register(classId, nodes[classId]);
        }
    },
    unregister: function(classId) {
        delete REGISTERED_NODES[classId];
    },
    get: function(classId) {
        return REGISTERED_NODES[classId];
    },
    getAll: function() {
        return REGISTERED_NODES;
    },
    isRegistered: function(classId) {
        return classId in REGISTERED_NODES;
    },
};

export { INode, NODES_REGISTRY };