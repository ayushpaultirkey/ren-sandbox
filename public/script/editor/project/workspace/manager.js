import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher.js";

class WorkspaceManager extends H12 {

    #workspaces = new Map();

    constructor() {
        super();
    }

    main(args) {
        
    }

    render() {
        return <>
            <div>
                {tabs}
            </div>
        </>;
    }

    addWorkspace(uuid, type, data) {
        
        if(this.#workspaces.has(uuid)) {
            console.error("Workspace already exists");
            return;
        };

        

    }

    removeWorkspace(uuid) {
        
        this.#workspaces.delete(uuid);

    }
    
    destroy() {
        dispatcher.clear("load-project");
        dispatcher.clear("unload-project");
        super.destroy();
    }
};

export { WorkspaceManager };