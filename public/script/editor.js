import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher.js";

import { Menu } from "../editor/control/menu";
import { Project } from "./editor/project";
import { Creator } from "./editor/creator";
import { readFile, writeFile } from "@adapter/fs";
import { loadPlugins } from "../editor/plugin";

class Editor extends H12 {

    #isReady = false;

    constructor() {
        super();
    }
    main(args) {
        this.load();
    }
    render() {
        return <>
            <div class="w-full h-full overflow-hidden bg-zinc-700 relative flex flex-col">
                <Menu args></Menu>
                <Project args id="project"></Project>
                <Creator args></Creator>
            </div>
        </>;
    }
    async load() {
        await loadPlugins();
        this.#isReady = true;
        await this.child.project.load();
    }
};

export { Editor };