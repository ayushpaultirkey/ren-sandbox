import { IObject } from "./object.js";
import { ISocket } from "./socket.js";
import { IPropertyManager } from "./property/manager.js";
import { IProperty } from "./property.js";
import { StringSocket } from "./sockets/primitive.js";

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
        
        this.custom = {};

        this.isEntry = false;

        this.#propertyManager = new IPropertyManager({ outer: this });

    }

    get propertyManager() {
        return this.#propertyManager;
    }

    main({ properties = {}, custom = {}, inputs = {}, outputs = {} } = {}) {
        try {

            if(custom) {
                this.custom = custom;
            };

            for(const uuid in inputs) {
                const socket = inputs[uuid];
                const socketClass = StringSocket;
                this.addInput(uuid, socket.name, socketClass, true);
            };
            for(const uuid in outputs) {
                const socket = outputs[uuid];
                const socketClass = StringSocket;
                this.addOutput(uuid, socket.name, socketClass, true);
            };
            

            for(const uuid in properties) {
                const property = properties[uuid];
                this.#propertyManager.setProperty(uuid, property.value);
            };

            return true;
        }
        catch(error) {
            console.error(error);
        }
    }
    
    addInput(uuid, name, socketClass, isRuntime = false) {
        
        if(!socketClass) return null;
        if(this.inputs[uuid]) return null;

        const socket = new socketClass({
            uuid: uuid,
            outer: this,
            name: name,
            type: ISocket.TYPES.INPUT,
            isRuntime: isRuntime
        });
        this.inputs[uuid] = socket;

        return socket;

    }
    removeInput(uuid) {
        const socket = this.inputs[uuid];
        if(socket.isRuntime) {
            delete this.inputs[uuid];
            return true;
        }
        else {
            console.error("Cannot remove static socket");
        }
    }
    addOutput(uuid, name, socketClass, isRuntime = false) {

        if(!socketClass) {
            console.error("Invalid socket class");
            return;
        };
        if(this.outputs[uuid]) {
            console.error("Socket already exists");
            return;
        };

        const socket = new socketClass({
            uuid: uuid,
            outer: this,
            name: name,
            type: ISocket.TYPES.OUTPUT,
            isRuntime: isRuntime
        });
        this.outputs[uuid] = socket;

        return socket;
        
    }
    removeOutput(uuid) {
        const socket = this.outputs[uuid];
        if(socket.isRuntime) {
            delete this.outputs[uuid];
            return true;
        }
        else {
            console.error("Cannot remove static socket");
        }
    }

    getInput(uuid) {
        return this.inputs[uuid];
    }
    getOutput(uuid) {
        return this.outputs[uuid];
    }
    getSocket(uuid) {
        return this.getInput(uuid) || this.getOutput(uuid);
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
            class: this.meta.className,
            properties: this.#propertyManager.export(),
            custom: this.custom || {},
            inputs: {},
            outputs: {},
        };

        for(const uuid in this.inputs) {
            const socket = this.inputs[uuid];
            if(!socket.isRuntime) continue;
            data.inputs[uuid] = {
                name: socket.name || "in",
                type: socket.subType,
            };
        };
        for(const uuid in this.outputs) {
            const socket = this.outputs[uuid];
            if(!socket.isRuntime) continue;
            data.outputs[uuid] = {
                name: socket.name || "out",
                type: socket.subType,
            };
        };

        let links = [];
        for(const uuid in this.outputs) {
            const socket = this.outputs[uuid];
            links = links.concat(socket.export());   
        };

        return { data: data, links: links };

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