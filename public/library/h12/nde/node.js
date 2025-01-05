import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/h12/dispatcher";
import Drag from "./drag";

import { Pin, ExecPin, IntPin } from "./pin";

class Node extends H12 {
    constructor() {
        super();
        this.uid = crypto.randomUUID();
    }
    main() {
        //Drag(this.root, this.element.handle, this);
    }
    render() {

        let v = this.args.value || 5;
        let x = this.args.x || 5;
        let y = this.args.y || 5;
        let title = this.args.title || "Title";

        return <>
            <div class="bg-zinc-800 w-20 border-2 border-zinc-100 text-zinc-100 px-1 text-xs absolute font-bold select-none" style={ `top: ${y}px; left: ${x}px;` }>
                <label id="handle">{ title }</label>
                <label>{v}</label>
                <div>
                    <pin args id="in0" alias={ ExecPin } title="in" side={ Pin.SIDE.INPUT }></pin>
                </div>
                <div>
                    <pin args id="in1" alias={ IntPin } title={ this.args.value } side={ Pin.SIDE.INPUT } value={ v }></pin>
                </div>
                <div class="text-right">
                    <pin args id="out0" alias={ ExecPin } title="out" side={ Pin.SIDE.OUTPUT }></pin>
                </div>
                <div class="text-right">
                    <pin args id="out1" alias={ IntPin } title={ this.args.value } side={ Pin.SIDE.OUTPUT } value={ v }></pin>
                </div>
                <button onclick={ this.execute }>🔴</button>
            </div>
        </>;

    }
    getValue() {

        const { in1 } = this.child;
        if(in1 && in1.links) {

            if(in1.links.length == 0) {
                return this.args.value;
            }

            let value = 0;
            for(let i = 0; i < in1.links.length; i++) {
                const link = in1.links[i];
                value += link.output.args.value * 1;
            }

            return value;

        }

        return "value";

    }
    execute() {

        const { out0, out1 } = this.child;
        const node = out0.getLinkNode(0);

        const val = this.getValue();
        out1.args.value = val;

        this.set("{v}", val);

        if(node) {
            node.execute();
        }

    }
}

export { Node }