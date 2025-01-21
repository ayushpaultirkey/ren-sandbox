import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher.js";
import { ActionBar } from "./project/actionbar";
import { StatusBar } from "./project/statusbar";
import { Workspace } from "./project/workspace";
import { WorkspaceRegistry } from "@config/registry";


class Project extends H12 {

    #isLoaded = false;

    constructor() {
        super();
    }

    async main(args) {
        
        dispatcher.on("open-workspace", (name, path) => {
            this.openWorkspace(name, path);
        });
        this.set("{workspaces}", "");            

    }
    
    render() {
        return <>
            <div class="project">
                <div class="project-area-tab">
                    <tabs args id="tabManager" alias={ ActionBar }></tabs>
                </div>
                <div class="project-area-workspace">
                    {workspaces}
                </div>
                <div class="project-area-status">
                    <statusbar args alias={ StatusBar }></statusbar>
                </div>
            </div>
        </>;
    }
    
    async openWorkspace(name, path) {

        const uuid = crypto.randomUUID();
        const extension = `.${path.split(".").slice(-1)[0]}`;
        const module = WorkspaceRegistry.get(extension);

        if(!module) {
            alert("Invalid file type");
            return;
        };

        this.set("{workspaces}++", <>
            <workspace args alias={ module } id={ uuid } path={ path }></workspace>
        </>);


        /** @type {{ tabManager: ActionBar }} */
        const { tabManager } = this.child;
        tabManager.addTab(uuid, name);
        tabManager.setActive(uuid);

        return uuid;
        
    }

    closeWorkspace(uuid) {
        this.child[uuid].destroy();
    }

    switchWorkspace(uuid) {
        
        for(const id in this.child) {
            const workspace = this.child[id];
            if(workspace instanceof Workspace) {
                workspace.isActive = false;
            };
        };
        this.child[uuid].isActive = true;

    }

    load(path) {
        try {

            if(this.#isLoaded) {
                throw new Error("Project already loaded");
            };

            this.openWorkspace("Explorer", path);
            this.openWorkspace("another", "main.ren");
            
            this.root.classList.remove("hidden");
            this.#isLoaded = true;

        }
        catch(error) {
            alert("Failed to load project");
            console.error(error);
        }

    }
    
    destroy() {
        super.destroy();
    }
};

export { Project };