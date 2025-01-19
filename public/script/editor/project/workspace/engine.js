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

        const data = {"a3a5ff3d-9c96-48ba-b407-c4fb6d08484c":{"graphs":{"edfa1a28-0932-43af-ba1b-85042da2c721":{"entry":"b32b8df0-2322-4b27-881b-3436a5c71e89","nodes":{"34939d61-67ec-407a-a843-4fc5f8ccd2dd":{"class":"INode.Value.MakeFloat","properties":{"value0":{"name":"value","type":"FLOAT","value":0,"custom":{}}},"custom":{"x":20,"y":390},"inputs":{},"outputs":{}},"b32b8df0-2322-4b27-881b-3436a5c71e89":{"class":"INode.Event.Begin","properties":{},"custom":{"x":20,"y":160},"inputs":{},"outputs":{}},"57b39bcf-aca9-4cf4-a962-667f58049a89":{"class":"INode.Event.Log","properties":{},"custom":{"x":360,"y":160},"inputs":{},"outputs":{}},"225549ba-80e2-4bdf-9269-450361d72ba3":{"class":"INode.Value.MakeString","properties":{"value0":{"name":"value","type":"STRING","value":"1111","custom":{}}},"custom":{"x":20,"y":230},"inputs":{},"outputs":{"2927e297-4ab1-4cae-b45f-226c5141ed39":{"name":"out","type":"STRING"},"ab361036-dc5b-4367-a589-4ecb5ac055cb":{"name":"out","type":"STRING"},"2b21d284-b95a-4b95-98af-7a5531eef1b3":{"name":"out","type":"STRING"},"87bcbb74-c9ba-4dc0-bf83-4f6f9504f068":{"name":"out","type":"STRING"}}},"ef505dfb-232f-4ba2-b66f-a4d0808a97f9":{"class":"INode.Event.Log","properties":{},"custom":{"x":360,"y":250},"inputs":{},"outputs":{}},"36f8e845-582d-4383-8c96-078022607fe2":{"class":"INode.Event.Log","properties":{},"custom":{"x":360,"y":320},"inputs":{},"outputs":{}},"3aa8de2c-1419-4256-85c1-e95dcc57d3e7":{"class":"INode.Event.Log","properties":{},"custom":{"x":360,"y":390},"inputs":{},"outputs":{}},"bb823943-5dda-4c5a-80c2-25a26d961f74":{"class":"INode.Event.Log","properties":{},"custom":{"x":360,"y":90},"inputs":{},"outputs":{}},"211a3f79-65c5-4748-8ea1-2acc6160318d":{"class":"INode.Event.Return","properties":{},"custom":{"x":510,"y":90},"inputs":{},"outputs":{}}},"links":[{"sourceNode":"b32b8df0-2322-4b27-881b-3436a5c71e89","sourceSocket":"out0","targetNode":"57b39bcf-aca9-4cf4-a962-667f58049a89","targetSocket":"in0"},{"sourceNode":"225549ba-80e2-4bdf-9269-450361d72ba3","sourceSocket":"value0","targetNode":"bb823943-5dda-4c5a-80c2-25a26d961f74","targetSocket":"value1"},{"sourceNode":"225549ba-80e2-4bdf-9269-450361d72ba3","sourceSocket":"2927e297-4ab1-4cae-b45f-226c5141ed39","targetNode":"57b39bcf-aca9-4cf4-a962-667f58049a89","targetSocket":"value1"},{"sourceNode":"225549ba-80e2-4bdf-9269-450361d72ba3","sourceSocket":"ab361036-dc5b-4367-a589-4ecb5ac055cb","targetNode":"ef505dfb-232f-4ba2-b66f-a4d0808a97f9","targetSocket":"value1"},{"sourceNode":"225549ba-80e2-4bdf-9269-450361d72ba3","sourceSocket":"2b21d284-b95a-4b95-98af-7a5531eef1b3","targetNode":"36f8e845-582d-4383-8c96-078022607fe2","targetSocket":"value1"},{"sourceNode":"225549ba-80e2-4bdf-9269-450361d72ba3","sourceSocket":"87bcbb74-c9ba-4dc0-bf83-4f6f9504f068","targetNode":"3aa8de2c-1419-4256-85c1-e95dcc57d3e7","targetSocket":"value1"},{"sourceNode":"bb823943-5dda-4c5a-80c2-25a26d961f74","sourceSocket":"out0","targetNode":"211a3f79-65c5-4748-8ea1-2acc6160318d","targetSocket":"in0"}],"properties":{},"custom":{"name":"fgh","x":61,"y":108,"z":"0.4500"}},"62f41d24-adf5-4e84-9b44-a87864d4504c":{"entry":null,"nodes":{},"links":[],"properties":{},"custom":{"name":"ry","x":9,"y":2,"z":"0.7000"}}},"properties":{},"custom":{"name":"Graph Set"}}};
        const key = "a3a5ff3d-9c96-48ba-b407-c4fb6d08484c";
        

        this.createEngine();
        //this.createGraphSet();
        this.createGraphSet(key, data[key]);

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
                <div class="border-2 min-w-[250px] max-w-[250px] border-zinc-950">properties</div>
            </div>
        </>

    }
    export() {
        const data = this.#igraphset.export();
        console.log(data);
        console.log(JSON.stringify(data));
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