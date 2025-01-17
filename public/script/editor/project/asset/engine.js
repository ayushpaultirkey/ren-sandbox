import { dispatcher } from "@script/dispatcher.js";

import { IEngine } from "../../../../node/engine";
import { Navigator } from "./engine/navigator";
import { Asset } from "../asset";

class UIEngine extends Asset {

    /** @type {IEngine} */
    #iengine = null;

    /** @type {IGraphSet} */
    #igraphset = null;

    constructor() {
        super();
    }
    main() {

        this.createEngine();
        this.addGraphSet();

        const { graph: uiGraph } = this.key;
        uiGraph("No graph selected");

    }
    render() {

        return <>
            <div class="w-full h-full flex flex-row">
                <Navigator args></Navigator>
                <div id="viewport" class="viewport w-full relative overflow-hidden border-2 border-zinc-950">
                    {graph}
                </div>
                <div class="border-2 min-w-[250px] max-w-[250px] border-zinc-950">properties</div>
            </div>
        </>

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
    addGraphSet(uuid, data = { properties: {}, graphs: {}, custom: {} }) {
        this.#igraphset = this.#iengine.addGraphSet(uuid, data);
        console.warn("Graph Set added");
    }


}

export { UIEngine };