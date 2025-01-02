import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/h12/dispatcher";
import { GNodePin, GNodePinExecIn, GNodePinExecOut } from "./pin"
import drag from "./drag"


class GNode extends H12 {
    constructor() {
        super();
    }
    render() {

        let x = this.args.x || 5;
        let y = this.args.y || 5;
        let title = this.args.title || "Title";

        return <>
            <div class="bg-zinc-800 text-zinc-100 px-1 space-x-3 text-xs absolute font-bold select-none" style={ `top: ${y}px; left: ${x}px;` }>
                <pin args alias={ GNodePinExecIn } title="in"></pin>
                <label onclick={ () => {console.warn(this.execute())} }>{ title }</label>
                <pin args id="execout" alias={ GNodePinExecOut } title="out"></pin>
            </div>
        </>;

    }
    execute() {

        let value = this.args.value;

        const { execout } = this.child;
        if(!execout) return value;

        const out = execout.getLinkedParent(0);
        if(out) {
            value += " " + out.execute();
        };

        return value;

    }
}

class GBeginNode extends GNode {
    constructor() {
        super();
    }
    main() {
        drag(this.root, this.element.handle, this);
    }
    render() {

        let x = this.args.x || 5;
        let y = this.args.y || 5;

        return <>
            <div class="bg-zinc-800 text-zinc-100 px-1 text-xs absolute font-bold select-none" style={ `top: ${y}px; left: ${x}px;` }>
                <div>
                    <button onclick={ () => {console.warn(this.execute())} }>exec()</button>
                </div>
                <div class="space-x-3">
                    <label id="handle">Begin</label>
                    <pin args id="execout" alias={ GNodePinExecOut } title="out"></pin>
                </div>
            </div>
        </>;

    }
}
class GTaskNode extends GNode {
    constructor() {
        super();
    }
    main() {
        drag(this.root, this.element.handle, this);
    }
    render() {

        let x = this.args.x || 5;
        let y = this.args.y || 5;
        let title = this.args.title || "Title";

        return <>
            <div class="bg-zinc-800 text-zinc-100 px-1 space-x-3 text-xs absolute font-bold select-none" style={ `top: ${y}px; left: ${x}px;` }>
                <pin args alias={ GNodePinExecIn } title="in"></pin>
                <label id="handle">{ title }</label>
                <pin args id="execout" alias={ GNodePinExecOut } title="out"></pin>
            </div>
        </>;

    }
}
class GEndNode extends GNode {
    constructor() {
        super();
    }
    main() {
        drag(this.root, this.element.handle, this);
    }
    render() {

        let x = this.args.x || 5;
        let y = this.args.y || 5;

        return <>
            <div class="bg-zinc-800 text-zinc-100 px-1 space-x-3 text-xs absolute font-bold select-none" style={ `top: ${y}px; left: ${x}px;` }>
                <pin args alias={ GNodePinExecIn } title="in"></pin>
                <label id="handle">End</label>
            </div>
        </>;

    }
}


export { GNode, GBeginNode, GTaskNode, GEndNode };