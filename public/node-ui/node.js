import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";

import { INode } from "../node/node";
import { UIPin } from "./pin";

class UINode extends H12 {
    constructor() {
        super();
    }
    render() {
        
        let x = this.args.x || 5;
        let y = this.args.y || 5;
        let title = this.args.title || "Title";

        this.inode = new INode({ uuid: this.args.uuid, outer: this.args.outer });

        return <>
            <div class="bg-zinc-800 w-28 text-zinc-100 border-2 border-green-500 p-1 space-y-1 text-xs absolute font-bold select-none" style={ `top: ${y}px; left: ${x}px;` }>
                <label class="mx-1">{ title }</label>
                <div>
                    <pin args alias={ UIPin } title="in"></pin>
                </div>
                <div class="text-right">
                    <pin args id="execout" alias={ UIPin } title="out"></pin>
                </div>
            </div>
        </>;

    }
}

export { UINode };