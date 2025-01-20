import { Workspace } from "@project/workspace";
import { IEngine } from "@vm/engine";

import { Navigator } from "@project/workspace/engine/navigator";
import { UIGraph } from "@project/workspace/engine/graph";
import { GraphProperty } from "@project/workspace/engine/graph-property";
import { readFile, writeFile } from "@adapter/fs";

class UIEngine extends Workspace {

    /** @type {IEngine} */
    #iengine = null;

    /** @type {import("@vm/graphset").IGraphSet} */
    #igraphset = null;

    constructor() {
        super();
        this.activeGraphUUID = null;
    }
    main(args) {

        this.load();

    }
    async load() {

        const path = this.args.path;
        let data = await readFile(path);

        if(!data) {
            alert("Failed to load file");
            return;
        };


        data = JSON.parse(data);

        let uuid = Object.keys(data)[0];
        if(!uuid || uuid.length < 5) {
            uuid = crypto.randomUUID();
        };

        this.createEngine();
        this.createGraphSet(uuid, data[uuid]);

        const { graph: uiGraph } = this.key;
        uiGraph(<><label class="text-zinc-500 text-xs font-semibold ml-2">No graph selected</label></>);

        this.dispatcher.on("openGraph", (uuid) => this.openGraph(uuid));

    }
    render() {

        return <>
            <div class="w-full h-full flex flex-row">
                <Navigator args id="navigator" workspace={ this }></Navigator>
                <div id="viewport" class="viewport w-full relative overflow-hidden border-2 border-zinc-950">
                    {graph}
                </div>
                <div class="border-2 min-w-[250px] max-w-[250px] border-zinc-950">
                    <property args id="graphProperty" alias={ GraphProperty } workspace={ this }></property>
                </div>
            </div>
        </>

    }
    export() {
        const data = this.#igraphset.export();
        console.log(data);
        console.log(JSON.stringify(data));
    }
    async save() {

        const data = this.#igraphset.export();
        const path = this.args.path;
        await writeFile(path, JSON.stringify(data));
        alert("Saved");

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
            };

            if(this.activeGraphUUID === uuid) {
                console.warn("Graph already open");
                return;
            };

            uiGraph("");
            if(this.child.graph) {
                this.child.graph.destroy();
            };

            const graph = this.#igraphset.getGraph(uuid);
            if(!graph) {
                throw new Error(`Graph ${uuid} not found`);
            };
            this.activeGraphUUID = uuid;
            //this.child.navigator.refreshGraph(graph);
            this.child.graphProperty.refresh(graph);

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