import { INode, NODES_REGISTRY } from "@vm/node.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "@vm/types/default.js";

import { GraphSetSocket, GraphSocket, ObjectSocket } from "@vm/sockets/user.js";
import { FloatSocket, StringSocket, WildcardSocket } from "@vm/sockets/primitive.js";
import { EventSocket, ExecutionSocket } from "@vm/sockets/derived.js";
import { ISocket } from "@vm/socket.js";

class GetGraph extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Reference.Graph.Get",
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
        className: "Javascript.Reference.GraphSet.Get",
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
        className: "Javascript.Reference.Graph.GetProperty",
        displayName: "Get Property",
        canCache: false
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {

        this.addOutput("value0", "value", WildcardSocket);

        this.propertyManager.addProperty("reference0", USER_DEFINED_TYPES.REFERENCE, "", { name: "reference" });

        super.main(args);

    }

    execute() {

        const graph = this.outer;

        const selfProperty = this.propertyManager.getProperty("reference0");
        const graphProperty = graph.propertyManager.getProperty(selfProperty.value);

        this.getOutput("value0").setValue(graphProperty.value);

    }

}

class GetGraphSetProperty extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Reference.GraphSet.GetProperty",
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
        className: "Javascript.Reference.Graph.SetProperty",
        displayName: "Set Property",
        canCache: true
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {

        this.addInput("in0", "in", ExecutionSocket);
        this.addInput("value0", "value", WildcardSocket);
        
        this.addOutput("out0", "out", ExecutionSocket);

        this.propertyManager.addProperty("reference0", USER_DEFINED_TYPES.REFERENCE, "", { name: "reference" });

        super.main(args);

    }

    execute() {

        const graph = graph || this.outer;
        const value = this.getInput("value0").getValue();

        const selfProperty = this.propertyManager.getProperty("reference0");
        graph.propertyManager.setProperty(selfProperty.value, value);

        this.executeLinkedNode("out0", 0);

    }

}

class SetGraphSetProperty extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Reference.GraphSet.SetProperty",
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

class CallGraph extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Reference.Graph.Call",
        displayName: "Call Graph",
        canCache: true
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {

        this.addInput("in_exec0", "in", ExecutionSocket);
        this.addInput("in_graphset0", "graphset (self)", GraphSetSocket);
        this.addInput("in_args0", "args", ObjectSocket);

        this.addOutput("out_exec0", "out", ExecutionSocket);
        this.addOutput("out_args0", "args", ObjectSocket);

        this.propertyManager.addProperty("graph0", USER_DEFINED_TYPES.REFERENCE, "", { name: "graph" });

        super.main(args);
    }

    execute() {

        /** @type {import("@vm/graphset").IGraphSet} */
        const graphSet = this.getInput("in_graphset0").getValue() || this.outer.outer;
        const value = this.getInput("in_args0").getValue() || {};

        const graphUUID = this.propertyManager.getProperty("graph0").value;
        if(!graphUUID) return;

        const graph = graphSet.getGraph(graphUUID);
        if(!graph) return;

        const graphSignature = graph.signature;
        if(!graphSignature) return;

        const newGraph = graphSet.addGraph(null, graphSignature);
        
        newGraph.inputs.setProperty("args0", value);
        const node = newGraph.getEntryNode();

        if(!node) return;
        node.execute();

        const output = newGraph.outputs.getProperty("args0").value;
        this.getOutput("out_args0").setValue(output);

        graphSet.removeGraph(newGraph.uuid);

        this.executeLinkedNode("out_exec0", 0);

    }

}

const nodes = [
    GetGraph,
    GetGraphSet,
    GetGraphProperty,
    GetGraphSetProperty,
    SetGraphProperty,
    SetGraphSetProperty,
    CallGraph
]

function register() {
    NODES_REGISTRY.registerMany(nodes);
};

function unregister() {
    NODES_REGISTRY.unregisterMany(nodes);
};

export { register, unregister, nodes };