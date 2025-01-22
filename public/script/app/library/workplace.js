import { Workspace } from "@project/workspace.js";

/**
    * 
    * @param {import("@library/h12").default} component 
    * @returns {Workspace}
*/
function getWorkplace(component) {

    let current = component;

    while(current) {
        if(current instanceof Workspace) {
            return current;
        };
        current = current.parent;
    }

}

export { getWorkplace };