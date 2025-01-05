import { LiteGraph, LGraph } from "@library/litegraph";



function BeginNode() {
    this.addOutput("Start", LiteGraph.EVENT);
}
BeginNode.title = "Begin";
BeginNode.prototype.onExecute = function () {
    console.log("Begin", this);

    const out = this.outputs[0];

    this.triggerSlot(0); // Trigger the output
};
LiteGraph.registerNodeType("flow/Begin", BeginNode);

// Define the "Task" Node
function TaskNode() {
    this.addInput("Trigger", LiteGraph.ACTION);
    this.addOutput("Next", LiteGraph.EVENT);
    this.addOutput("Data", "string"); // Example data output
}
TaskNode.title = "Task";
TaskNode.prototype.onExecute = function () {
    console.log("Task executed");
    this.setOutputData(1, "Task completed");
    this.triggerSlot(0); // Trigger the next node
};
LiteGraph.registerNodeType("flow/Task", TaskNode);

// Define the "End" Node
function EndNode() {
    this.addInput("Finish", LiteGraph.ACTION);
    this.addInput("Data", "string"); // Example data input
}
EndNode.title = "End";
EndNode.prototype.onExecute = function () {
    const data = this.getInputData(1); // Get the data from Task
    console.log("End executed with data:", data);
    this.graph.stop();
};
LiteGraph.registerNodeType("flow/End", EndNode);