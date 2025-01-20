import { WorkspaceRegistry } from "@config/registry";
import { UIEngine } from "./script/engine";
import { dispatcher } from "@script/dispatcher";

function register() {

    WorkspaceRegistry.set(".ren", UIEngine);
    console.log("registered");
    
    dispatcher.emit("add-menu", "ren-menu", "Graph", {
        "Open": {
            "Project": () => { console.log("Open Graph Set"); },
        },
        "Context Explorer": () => { console.log("Open Graph Set"); },
    });

}
function unregister() {
    
    WorkspaceRegistry.delete(".ren");

    dispatcher.emit("remove-menu", "ren-menu");

    console.log("unregistered");

}


export { register, unregister };