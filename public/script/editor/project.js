import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher.js";
import { ActionBar } from "./project/actionbar";
import { StatusBar } from "./project/statusbar";

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
                    {engine}
                </div>
                <div>
                    <statusbar args alias={ StatusBar }></statusbar>
                </div>
            </div>
        </>;
    }
    async load() {
        try {

            if(this.isLoaded) {
                throw new Error("Project already loaded");
            }

            const { UIEngine } = await import("./project/workspace/engine");

            this.set("{engine}", <>
                <engine args alias={ UIEngine }></engine>
            </>);

            this.root.classList.remove("hidden");
            this.root.classList.add("flex");
            this.isLoaded = true;

        }
        catch(error) {
            alert("Failed to load project");
            console.error(error);
        }

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