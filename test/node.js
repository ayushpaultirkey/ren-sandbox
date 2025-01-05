import { Data } from "./data.js";
import { Graph, graphs } from "./graph.js";
import { Pin } from "./pin.js";
import chalk from "chalk";

class Node extends Data {
    constructor(uid, outer) {
        super(uid, outer);
        this.in = {};
        this.out = {};
    }
    execute() {}
    connect(i, o) {
        i.pin = o;
        o.pin = i;
    }
}


class BeginNode extends Node {
    constructor(uid, outer) {
        super(uid, outer);
        this.out = {
            out0: new Pin(this)
        }
        this.name = "begin";
    }
    execute() {
        console.log(chalk.red(this.outer.name), chalk.green(this.name));
        if(this.out.out0.pin && this.out.out0.pin.outer) {
            this.out.out0.pin.outer.execute();
        }
    }
}
class AddNode extends Node {
    constructor(uid, outer, value = 5) {
        super(uid, outer);
        this.in = {
            in0: new Pin(this)
        }
        this.out = {
            out0: new Pin(this, value)
        }
        this.name = "add";
    }
    getValue() {
        const inPin = this.in.in0.pin;
        if(inPin) {
            this.out.out0.value = this.in.in0.pin.value;
        }
        return this.out.out0.value;
    }
    execute() {
        console.log(chalk.red(this.outer.name), chalk.green(this.name));
        if(this.out.out0.pin && this.out.out0.pin.outer) {
            this.out.out0.pin.outer.execute();
        }
    }
}
class CallNode extends Node {
    constructor(uid, outer, data) {
        super(uid, outer);
        this.in = {
            in0: new Pin(this)
        }
        this.out = {
            out0: new Pin(this)
        }
        this.data = data;
        this.name = "call";
    }
    execute() {

        console.log(chalk.red(this.outer.uid), chalk.green(this.name));

        graphs[this.data].nodes.Begin.execute(0);

        if(this.out.out0.pin && this.out.out0.pin.outer) {
            this.out.out0.pin.outer.execute();
        }

    }
}
class EndNode extends Node {
    constructor(uid, outer) {
        super(uid, outer);
        this.in = {
            in0: new Pin(this)
        }
        this.name = "end";
    }
    getValue() {

        const inValue = this.in.in0.value;
        const inPin = this.in.in0.pin;
        if(inPin && inValue) {
            return this.out.out0.value;
        }


    }
    execute() {
        console.log(chalk.red(this.outer.name), chalk.green(this.name));
    }
}

export { Node, BeginNode, EndNode, AddNode, CallNode };