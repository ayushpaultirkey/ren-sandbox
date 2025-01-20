import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher.js";
import { ActionBar } from "./project/actionbar";
import { StatusBar } from "./project/statusbar";
import { Workspace } from "./project/workspace";
import { WorkspaceRegistry } from "@config/registry";
import { readFile } from "@adapter/fs";


class Project extends H12 {
    constructor() {
        super();
        this.isLoaded = false;
    }
    async main(args) {
        
        dispatcher.on("load-project", () => {
            this.load();
        });
        dispatcher.on("unload-project", () => {
            this.unload();
        });
        dispatcher.on("open-workspace", (name, path) => {
            this.openWorkspace(name, path);
        });
        this.set("{workspaces}", "");

        // this.load();
        // console.log(await writeFile("app.js", "bruh"));
        // console.log(await readFile("app.js"));

    }
    
    render() {
        return <>
            <div class="w-full h-full flex-col hidden">
                <div class="border-2 border-zinc-950">
                    <tabs args id="tabManager" alias={ ActionBar }></tabs>
                </div>
                <div class="w-full h-full">
                    {workspaces}
                </div>
                <div class="border-2 border-zinc-900">
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

            if(this.isLoaded) {
                throw new Error("Project already loaded");
            }

            const data = {"a3a5ff3d-9c96-48ba-b407-c4fb6d08484c":{"graphs":{"edfa1a28-0932-43af-ba1b-85042da2c721":{"entry":"b32b8df0-2322-4b27-881b-3436a5c71e89","nodes":{"34939d61-67ec-407a-a843-4fc5f8ccd2dd":{"class":"INode.Value.MakeFloat","properties":{"value0":{"name":"value","type":"FLOAT","value":0,"custom":{}}},"custom":{"x":20,"y":390},"inputs":{},"outputs":{}},"b32b8df0-2322-4b27-881b-3436a5c71e89":{"class":"INode.Event.Begin","properties":{},"custom":{"x":90,"y":90},"inputs":{},"outputs":{}},"57b39bcf-aca9-4cf4-a962-667f58049a89":{"class":"INode.Event.Log","properties":{},"custom":{"x":360,"y":160},"inputs":{},"outputs":{}},"225549ba-80e2-4bdf-9269-450361d72ba3":{"class":"INode.Value.MakeString","properties":{"value0":{"name":"value","type":"STRING","value":"1111","custom":{}}},"custom":{"x":90,"y":160},"inputs":{},"outputs":{}},"ef505dfb-232f-4ba2-b66f-a4d0808a97f9":{"class":"INode.Event.Log","properties":{},"custom":{"x":360,"y":250},"inputs":{},"outputs":{}},"36f8e845-582d-4383-8c96-078022607fe2":{"class":"INode.Event.Log","properties":{},"custom":{"x":360,"y":320},"inputs":{},"outputs":{}},"3aa8de2c-1419-4256-85c1-e95dcc57d3e7":{"class":"INode.Event.Log","properties":{},"custom":{"x":360,"y":390},"inputs":{},"outputs":{}},"bb823943-5dda-4c5a-80c2-25a26d961f74":{"class":"INode.Event.Log","properties":{},"custom":{"x":360,"y":90},"inputs":{},"outputs":{}},"211a3f79-65c5-4748-8ea1-2acc6160318d":{"class":"INode.Event.Return","properties":{},"custom":{"x":510,"y":90},"inputs":{},"outputs":{}}},"links":[{"sourceNode":"b32b8df0-2322-4b27-881b-3436a5c71e89","sourceSocket":"out0","targetNode":"bb823943-5dda-4c5a-80c2-25a26d961f74","targetSocket":"in0"},{"sourceNode":"225549ba-80e2-4bdf-9269-450361d72ba3","sourceSocket":"value0","targetNode":"bb823943-5dda-4c5a-80c2-25a26d961f74","targetSocket":"value1"},{"sourceNode":"bb823943-5dda-4c5a-80c2-25a26d961f74","sourceSocket":"out0","targetNode":"211a3f79-65c5-4748-8ea1-2acc6160318d","targetSocket":"in0"}],"properties":{},"custom":{"name":"fgh","x":-36,"y":37,"z":"0.8500"}},"62f41d24-adf5-4e84-9b44-a87864d4504c":{"entry":null,"nodes":{},"links":[],"properties":{},"custom":{"name":"ry","x":9,"y":2,"z":"0.7000"}}},"properties":{},"custom":{"name":"Graph Set"}}}
            const uuid = Object.keys(data)[0];

            //this.openWorkspace("main.ren", data);
            this.openWorkspace("Explorer", path);
            
            // if(this.isLoaded) {
            //     throw new Error("Project already loaded");
            // }


            // const { UIEngine } = await import("./project/workspace/engine");

            // this.set("{workspaces}", <>
            //     <engine args alias={ UIEngine } uuid={ uuid } graphset={ graphSet }></engine>
            // </>);

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