import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher.js";

import { Menu } from "../editor/control/menu";
import { Project } from "./editor/project";
import { Creator } from "./editor/creator";
import { readFile, writeFile } from "@adapter/fs";
import { loadPlugins } from "../editor/plugin";
import { getArguments } from "@adapter/argv";

class Editor extends H12 {

    #isReady = false;

    get isReady() {
        return this.#isReady;
    }

    constructor() {
        super();
    }

    main(args) {

        this.set("{overlay}", "");
        this.#registerDispatchers();

        this.load();

    }

    render() {
        return <>
            <div class="w-full h-full overflow-hidden bg-zinc-700 relative">
                <div class="w-full h-full flex flex-col">
                    <Menu args></Menu>
                    <Project args id="project"></Project>
                </div>
                <div>
                    {overlay}
                </div>
            </div>
        </>;
    }

    #registerDispatchers() {

        dispatcher.on("add-overlay", (overlay) => {
            this.set("{overlay}++", <>
                <overlay args alias={ overlay }></overlay>
            </>);
        });

    }

    async load() {

        await loadPlugins();
        const path = await getArguments();
        if(!path || !path[0]) {
            return;
        }

        await this.child.project.load(path[0]);

        this.#isReady = true;

    }
};

export { Editor };