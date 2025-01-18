import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher.js";

import { UIEngine } from "./project/workspace/engine";
import { ActionBar } from "./project/actionbar";

class Project extends H12 {
    constructor() {
        super();
        this.isLoaded = false;
    }
    main(args) {
        
        dispatcher.on("load-project", () => {
            this.load();
        });
        dispatcher.on("unload-project", () => {
            this.unload();
        });
        this.load();

    }
    render() {
        return <>
            <div class="w-full h-full flex-col hidden">
                <div>
                    <actionbar args alias={ ActionBar }></actionbar>
                </div>
                <div class="w-full h-full">
                    <engine id="en1" args alias={ UIEngine }></engine>
                </div>
                <div>
                    status
                </div>
            </div>
        </>;
    }
    load() {

        if(this.isLoaded) {
            console.error("Project already loaded");
            alert("Project already loaded");
            return;
        }

        this.root.classList.remove("hidden");
        this.root.classList.add("flex");
        this.isLoaded = true;

    }
    unload() {
        this.root.classList.add("hidden");
        this.root.classList.remove("flex");
        this.isLoaded = false;
    }
    destroy() {
        dispatcher.clear("load-project");
        dispatcher.clear("unload-project");
        super.destroy();
    }
};

export { Project };