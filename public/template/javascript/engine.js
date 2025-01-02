class Node {
    constructor(uid) {
        this.uid = uid || crypto.randomUUID();
        this.in = {};
        this.out = {};
    }
    export() {
        const outPins = {};
        Object.keys(this.out).forEach(pin => {
            const nodeId = this.out[pin].node.uid;
            outPins[pin] = { nodeId: nodeId }
        });
        return {
            nodeId: this.nodeId,
            nodeLinks: outPins
        }
    }
}
class Pin {
    constructor(uid, pinId) {
        this.uid = uid || crypto.randomUUID();
        this.node = null;
        this.link = null;
        this.pinId = pinId;
    }
}
class ExecIn extends Pin {
    constructor(uid, pinId) {
        super(uid, pinId);
    }
}
class ExecOut extends Pin {
    constructor(uid, pinId) {
        super(uid, pinId);
    }
}
const register_pins = { "exec.in": ExecIn, "exec.out": ExecOut };

class Begin extends Node {
    constructor(uid) {
        super(uid);
        this.nodeId = "function.begin";
        this.in = {};
        this.out = {
            execOut0: new ExecOut()
        };
    }
    execute() {
        console.log("Begin");
        if(this.out.execOut0) {
            this.out.execOut0.node.execute();
        }
    }
}
class Task extends Node {
    constructor(uid) {
        super(uid);
        this.nodeId = "task";
        this.in = {
            execIn0: new ExecIn()
        };
        this.out = {
            execOut0: new ExecOut()
        };
    }
    execute() {
        console.log("Task");
        if(this.out.execOut0) {
            this.out.execOut0.node.execute();
        }
    }
}
class End extends Node {
    constructor(uid) {
        super(uid);
        this.nodeId = "function.end";
        this.in = {
            execIn0: new ExecIn(null, "execIn0")
        };
        this.out = {};
    }
    execute() {
        console.log("End");
    }
}
const registered_nodes = { "function.begin": Begin, "task": Task, "function.end": End }

// const begin = new Begin();
// const task = new Task();
// const end = new End();

// begin.out.execOut0.link = task.in.execIn0;
// begin.out.execOut0.node = task;

// task.out.execOut0.link = end.in.execIn0;
// task.out.execOut0.node = end;

// const nodes = {
//     "function.begin": Begin,
//     "task": Task,
//     "function.end": End
// }

// begin.execute();

// const nodesList = [begin, task, end];

// function exports() {

//     const data = {};

//     nodesList.forEach(list => {
//         data[list.uid] = list.export();
//     });

//     console.dir(data, { depth: null });

// };
// exports();

const graph_data = {
    'f0fec471-1c2b-4808-abf2-385939ad5b00': {
      nodeId: 'function.begin',
      nodeLinks: {
        execOut0: {
          nodeId: 'ca2da457-e394-44fd-967a-3f5a935860e3',
          pinId: 'execIn0'
        }
      }
    },
    'ca2da457-e394-44fd-967a-3f5a935860e3': {
      nodeId: 'task',
      nodeLinks: {
        execOut0: {
          nodeId: 'ca2da457-et94-44fd-967a-3f5a935860e3',
          pinId: 'execIn0'
        }
      }
    },
    'ca2da457-et94-44fd-967a-3f5a935860e3': {
      nodeId: 'task',
      nodeLinks: {
        execOut0: {
          nodeId: 'c302af42-3a01-4a06-b653-9dcd48d1c41e',
          pinId: 'execIn0'
        }
      }
    },
    'c302af42-3a01-4a06-b653-9dcd48d1c41e': { nodeId: 'function.end', nodeLinks: {} }
}

function engine() {
    const nodes = {};
    const nodeIDs = Object.keys(graph_data);
    
    nodeIDs.forEach(nodeID => {

        const node = graph_data[nodeID];

        const nodeClass = registered_nodes[node.nodeId];

        nodes[nodeID] = new nodeClass(nodeID);
        

    });

    nodeIDs.forEach(nodeID => {

        const node = graph_data[nodeID];
        const outPins = node.nodeLinks;

        Object.keys(outPins).forEach(outPinID => {

            const outPin = outPins[outPinID];

            nodes[nodeID].out[outPinID].link = nodes[outPin.nodeId].in[outPin.pinId];
            nodes[nodeID].out[outPinID].node = nodes[outPin.nodeId];

            console.log(nodes[nodeID].out[outPinID].link)

        });

    });

    const firstNode = nodes[nodeIDs[0]];
    firstNode.execute();
}
engine();