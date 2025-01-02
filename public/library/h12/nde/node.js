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
        Drag(this.root, this.element.handle, this)
    }
    render() {

        let v = this.args.value || 5;
        let x = this.args.x || 5;
        let y = this.args.y || 5;
        let title = this.args.title || "Title";

        return <>
            <div class="bg-zinc-800 w-16 text-zinc-100 px-1 text-xs absolute font-bold select-none" style={ `top: ${y}px; left: ${x}px;` }>
                <label id="handle">{ title }</label>
                <label>{v}</label>
                <div>
                    <pin args id="execin" alias={ ExecPin } title="in" side={ Pin.SIDE.INPUT }></pin>
                </div>
                <div>
                    <pin args id="intin" alias={ IntPin } title={ this.args.value } side={ Pin.SIDE.INPUT } value={ v }></pin>
                </div>
                <div class="text-right">
                    <pin args id="execout" alias={ ExecPin } title="out" side={ Pin.SIDE.OUTPUT }></pin>
                </div>
                <div class="text-right">
                    <pin args id="intout" alias={ IntPin } title={ this.args.value } side={ Pin.SIDE.OUTPUT } value={ v }></pin>
                </div>
                <button onclick={ this.execute }>🔴</button>
            </div>
        </>;

    }
    getValue() {

        const { intin } = this.child;
        if(intin && intin.links) {

            if(intin.links.length == 0) {
                return this.args.value;
            }

            let value = 0;
            for(let i = 0; i < intin.links.length; i++) {
                const link = intin.links[i];
                value += link.output.args.value * 1;
            }

            return value;

        }

        return "value";

    }
    execute() {

        const { execout, intout } = this.child;
        const node = execout.getLinkNode(0);

        const val = this.getValue();
        intout.args.value = val;

        this.set("{v}", val);

        if(node) {
            node.execute();
        }

    }
}

export { Node }