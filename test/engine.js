import { Graph, graphs } from "./graph.js";
import { Node, BeginNode, EndNode, AddNode, CallNode } from "./node.js";
import { Pin } from "./pin.js";

const g2 = new Graph();
g2.name = "Graph 2";

g2.createNode("Begin", BeginNode);
g2.createNode("Add 1", AddNode);
g2.createNode("Add 2", AddNode);
g2.createNode("Add 3", AddNode);
g2.createNode("End", EndNode);

g2.getNode("Begin").connect(g2.getNode("Begin").out.out0, g2.getNode("Add 1").in.in0);
g2.getNode("Add 1").connect(g2.getNode("Add 1").out.out0, g2.getNode("Add 2").in.in0);
g2.getNode("Add 2").connect(g2.getNode("Add 2").out.out0, g2.getNode("Add 3").in.in0);
g2.getNode("Add 3").connect(g2.getNode("Add 3").out.out0, g2.getNode("End").in.in0);


const g1 = new Graph();

g1.name = "Graph 1";

g1.createNode("Begin", BeginNode);
g1.createNode("Call", CallNode, g2.uid);
g1.createNode("Add 2", AddNode);
g1.createNode("End", EndNode);

g1.getNode("Begin").connect(g1.getNode("Begin").out.out0, g1.getNode("Call").in.in0);
g1.getNode("Call").connect(g1.getNode("Call").out.out0, g1.getNode("Add 2").in.in0);
g1.getNode("Add 2").connect(g1.getNode("Add 2").out.out0, g1.getNode("End").in.in0);

g1.getNode("Begin").execute();
