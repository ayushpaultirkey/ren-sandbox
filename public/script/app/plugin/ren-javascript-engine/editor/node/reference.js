import { INode, NODES_REGISTRY } from "@vm/node.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "@vm/types/default.js";

import { GraphSetSocket, GraphSocket, ObjectSocket } from "@vm/sockets/user.js";
import { FloatSocket, StringSocket, WildcardSocket } from "@vm/sockets/primitive.js";
import { EventSocket, ExecutionSocket } from "@vm/sockets/derived.js";
import { ISocket } from "@vm/socket.js";

class GetGraph extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Reference.Graph.Get",
        displayName: "Get Graph",
        canCache: false
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("graphset0", "graphset (self)", GraphSetSocket);
        this.addOutput("graph0", "graph", GraphSocket);
        this.propertyManager.addProperty("reference0", USER_DEFINED_TYPES.REFERENCE, "", { name: "reference" });
        super.main(args);
    }

    execute() {

        const graphSet = this.getInput("graphset0").getValue();
        const reference = this.propertyManager.getProperty("reference0").value;

        /** @type {import("@vm/graphset").IGraphSet} */
        const resolved = graphSet || this.outer.outer;

        const graph = resolved.getGraph(reference);

        this.getOutput("graph0").setValue(graph || null);

    }

}

class GetGraphSet extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Reference.GraphSet.Get",
        displayName: "Get GraphSet",
        canCache: false
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addOutput("graphset0", "graphset", GraphSetSocket);
        super.main(args);
    }

    execute() {
        this.getOutput("graphset0").setValue(this.outer.outer);
    }

}


class GetGraphProperty extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Reference.Graph.GetProperty",
        displayName: "Get Property",
        canCache: false
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {

        this.addInput("graph0", "graph (self)", GraphSocket);
        this.addOutput("value0", "value", WildcardSocket);

        this.propertyManager.addProperty("reference0", USER_DEFINED_TYPES.REFERENCE, "", { name: "reference" });

        super.main(args);

    }

    execute() {

        const graph = this.getInput("graph0").getValue();
        const resolved = graph || this.outer;

        const selfProperty = this.propertyManager.getProperty("reference0");
        const graphProperty = resolved.propertyManager.getProperty(selfProperty.value);

        this.getOutput("value0").setValue(graphProperty.value);

    }

}

class GetGraphSetProperty extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Reference.GraphSet.GetProperty",
        displayName: "Get Property",
        canCache: false
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {

        this.addInput("graphset0", "graphset (self)", GraphSetSocket);
        this.addOutput("value0", "value", WildcardSocket);

        this.propertyManager.addProperty("reference0", USER_DEFINED_TYPES.REFERENCE, "", { name: "reference" });

        super.main(args);
    }

    execute() {

        const graphSet = this.getInput("graphset0").getValue();
        const resolved = graphSet || this.outer.outer;

        const selfProperty = this.propertyManager.getProperty("reference0");
        const graphProperty = resolved.propertyManager.getProperty(selfProperty.value);

        this.getOutput("value0").setValue(graphProperty.value);

    }

}

class SetGraphProperty extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Reference.Graph.SetProperty",
        displayName: "Set Property",
        canCache: true
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {

        this.addInput("in0", "in", ExecutionSocket);
        this.addInput("graph0", "graph (self)", GraphSocket);
        this.addInput("value0", "value", WildcardSocket);
        
        this.addOutput("out0", "out", ExecutionSocket);

        this.propertyManager.addProperty("reference0", USER_DEFINED_TYPES.REFERENCE, "", { name: "reference" });

        super.main(args);

    }

    execute() {

        const graph = this.getInput("graph0").getValue();
        const value = this.getInput("value0").getValue();

        const resolved = graph || this.outer;

        const selfProperty = this.propertyManager.getProperty("reference0");
        resolved.propertyManager.setProperty(selfProperty.value, value);

        this.executeLinkedNode("out0", 0);

    }

}

class SetGraphSetProperty extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Reference.GraphSet.SetProperty",
        displayName: "Set Property",
        canCache: true
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {

        this.addInput("in0", "in", ExecutionSocket);
        this.addInput("graphset0", "graphset (self)", GraphSetSocket);
        this.addInput("value0", "value", WildcardSocket);

        this.addOutput("out0", "out", ExecutionSocket);

        this.propertyManager.addProperty("reference0", USER_DEFINED_TYPES.REFERENCE, "", { name: "reference" });

        super.main(args);
    }

    execute() {

        const graphSet = this.getInput("graphset0").getValue();
        const value = this.getInput("value0").getValue();

        const resolved = graphSet || this.outer.outer;

        const selfProperty = this.propertyManager.getProperty("reference0");
        resolved.propertyManager.setProperty(selfProperty.value, value);

        this.executeLinkedNode("out0", 0);

    }

}

const nodes = [
    GetGraph,
    GetGraphSet,
    GetGraphProperty,
    GetGraphSetProperty,
    SetGraphProperty,
    SetGraphSetProperty
]

function register() {
    NODES_REGISTRY.registerMany(nodes);
};

function unregister() {
    NODES_REGISTRY.unregisterMany(nodes);
};

export { register, unregister, nodes };