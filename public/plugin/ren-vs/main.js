import { WorkspaceRegistry } from "@config/registry";
import { UIEngine } from "./script/engine";
import { dispatcher } from "@script/dispatcher";
import { Creator } from "./script/creator";

function register() {

    WorkspaceRegistry.set(".ren", UIEngine);
    dispatcher.emit("add-menu", "ren-menu", "Ren", {
        "New": {
            "Graph Set": async () => {
                dispatcher.emit("add-overlay", Creator);
            },
        },
    });

    console.warn("registered");

}
function unregister() {
    
    WorkspaceRegistry.delete(".ren");
    dispatcher.emit("remove-menu", "ren-menu");

    console.log("unregistered");

}


export { register, unregister };