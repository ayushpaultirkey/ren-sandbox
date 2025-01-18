import { Workspace } from "../workspace";
import { IEngine } from "@vm/engine";
import { Navigator } from "./engine/navigator";
import { UIGraph } from "./engine/graph";

class UIEngine extends Workspace {

    /** @type {IEngine} */
    #iengine = null;

    /** @type {import("@vm/graphset").IGraphSet} */
    #igraphset = null;

    constructor() {
        super();
        this.activeGraphUUID = null;
    }
    main() {

        this.createEngine();
        this.createGraphSet();

        const { graph: uiGraph } = this.key;
        uiGraph(<><label class="text-zinc-500 text-xs font-semibold ml-2">No graph selected</label></>);

        this.dispatcher.on("openGraph", (uuid) => this.openGraph(uuid));

    }
    render() {

        return <>
            <div class="w-full h-full flex flex-row">
                <Navigator args id="navigator"></Navigator>
                <div id="viewport" class="viewport w-full relative overflow-hidden border-2 border-zinc-950">
                    {graph}
                </div>
                <div class="border-2 min-w-[250px] max-w-[250px] border-zinc-950">properties</div>
            </div>
        </>

    }
    debug() {
        console.log(this.#iengine);
    }

    getViewport() {
        return this.element.viewport;
    }

    createEngine() {
        this.#iengine = new IEngine();
        console.warn("IEngine added");
    }
    destroyEngine() {
        this.#iengine.destroy();
        this.#iengine = null;
        console.warn("IEngine destroyed");
    }

    createGraphSet(uuid, data = { properties: {}, graphs: {}, custom: {} }) {
        this.#igraphset = this.#iengine.addGraphSet(uuid, data);
        this.child.navigator.refreshGraphSet(this.#igraphset);
        console.warn("Graph Set added");
    }

    openGraph(uuid) {
        try {

            const { graph: uiGraph } = this.key;

            if(!uuid) {
                uiGraph(<><label class="text-zinc-500 text-xs font-semibold ml-2">No graph selected</label></>);
            }

            if(this.activeGraphUUID === uuid) {
                console.warn("Graph already open");
                return;
            }

            uiGraph("");
            if(this.child.graph) {
                this.child.graph.destroy();
            }

            const graph = this.#igraphset.getGraph(uuid);
            if(!graph) {
                throw new Error(`Graph ${uuid} not found`);
            }
            this.activeGraphUUID = uuid;
            this.child.navigator.refreshGraph(graph);

            uiGraph(<>
                <graph args alias={ UIGraph } iobject={ graph } id="graph"></graph>
            </>);

            console.warn("Graph opened");

        }
        catch(error) {
            console.error(error || "Error opening graph");
        }
    }
    destroy() {
        if(this.#iengine) {
            this.#iengine.destroy();
        };
        super.destroy();
    }
}

export { UIEngine };