import H12 from "@library/h12";
import { IGraph } from "../../node/graph";
import { Label, InputBox } from "../../editor/control";


class UIGraphDetail extends H12 {

    /** @type {IGraph} */
    #igraph = null;

    get igraph() {
        return this.#igraph;
    }
    set igraph(graph) {
        this.#igraph = graph;
        this.refresh();
    }

    constructor() {
        super();
    }
    
    refresh() {

        this.child.graphName.setValue(this.#igraph.custom.name);
        this.child.graphName.dispatcher.on("onUpdated", (value) => {
            if(!this.#igraph) return;
            this.#igraph.custom.name = value;
            this.#igraph.outer.dispatcher.emit("graphCustomUpdated");
        });

    }
    render() {
        return <>
            <div class="text-zinc-400 space-y-1">
                <control args id="graphName" alias={ InputBox } title="Name"></control>
            </div>
        </>
    }
    destroy() {
        this.child.graphName.dispatcher.clearAll("onUpdated");
        super.destroy();
    }
}

export { UIGraphDetail };