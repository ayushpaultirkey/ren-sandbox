import { Workspace } from "@project/workspace.js";

let activeWorkspace = null;

/**
    * 
    * @param {import("@library/h12").default} component 
    * @returns {Workspace}
*/
function getWorkspace(component) {

    let current = component;

    while(current) {
        if(current instanceof Workspace) {
            return current;
        };
        current = current.parent;
    }

}

function getActiveWorkspace() {
    return activeWorkspace;
}
function setActiveWorkspace(workspace) {
    activeWorkspace = workspace;
}

export { getWorkspace, getActiveWorkspace, setActiveWorkspace };