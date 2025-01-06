import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";
import Drag from "./drag";

import { INode } from "../node/node";
import { IPin } from "../node/pin";
import { ExecPin } from "../node/pins/exec";
import { UIPin } from "./pin";

class UINode extends H12 {
    constructor() {
        super();
        this.inode = null;
    }
    main(args = {}) {
        
        Drag(this.root, this.root);

    }
    render() {
        
        if(this.args.iobject) {
            this.inode = this.args.iobject;
            this.inode.addInputPin("in0", ExecPin, IPin.SUB_TYPES.EXEC);
            this.inode.addOutputPin("out0", ExecPin, IPin.SUB_TYPES.EXEC);
        };

        const x = this.args.x || 5;
        const y = this.args.y || 5;
        const title = this.args.title || "Title";

        return <>
            <div class="bg-zinc-800 w-28 text-zinc-100 border-2 border-green-500 p-1 space-y-1 text-xs absolute font-bold select-none" style={ `top: ${y}px; left: ${x}px;` }>
                <label id="handle" class="mx-1">{ title + ": " + this.inode.getUUID() }</label>
                <div>
                    <pin args alias={ UIPin } title="in0" iobject={ this.inode.getInputPin("in0") }></pin>
                </div>
                <div class="text-right">
                    <pin args alias={ UIPin } title="out0" iobject={ this.inode.getOutputPin("out0") }></pin>
                </div>
            </div>
        </>;

    }
}

export { UINode };