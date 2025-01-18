import { Workspace } from "@script/editor/project/workspace";

/**
    * 
    * @param {import("@library/h12").default} component 
    * @returns {import("@script/editor/project/workspace").Workspace}
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