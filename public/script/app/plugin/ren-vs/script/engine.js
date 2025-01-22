import "./../style/main.css";
import { Workspace } from "@project/workspace";
import { IEngine } from "@vm/engine";

import { Navigator } from "./engine/navigator";
import { UIGraph } from "./engine/graph";
import { GraphProperty } from "./engine/graph-property";
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
        uiGraph(<><label class="message">No graph selected</label></>);

        this.dispatcher.on("openGraph", (uuid) => this.openGraph(uuid));

    }
    render() {

        return <>
            <div class="project-workspace">
                <Navigator args id="navigator" workspace={ this }></Navigator>
                <div id="viewport" class="viewport">
                    {graph}
                </div>
                <property args id="graphProperty" alias={ GraphProperty } workspace={ this }></property>
            </div>
        </>

    }
    export() {

        const data = this.#igraphset.export();
        const exportData = JSON.stringify(data);

        console.log(data);
        console.log(exportData);

        const blob = new Blob([ exportData ], { type: "text/plain" });
        const a = document.createElement("a");
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = (this.#igraphset.custom.name || "graphset") + ".ren";
        a.click();
        URL.revokeObjectURL(url);

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