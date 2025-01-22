import { WorkspaceRegistry } from "@config/registry.js";
import { dispatcher } from "@event/dispatcher.js";
import { Explorer } from "./script/explorer";

function register() {

    WorkspaceRegistry.set(".*", Explorer);
    dispatcher.emit("add-menu", "explorer-menu", "Explorer", {
        "Open": () => {
            dispatcher.emit("open-workspace", "Explorer", ".*");
        },
    });

    console.warn("registered");
    
}
function unregister() {
    
    WorkspaceRegistry.delete(".*");
    dispatcher.emit("remove-menu", "explorer-menu");

    console.warn("unregistered");

}


export { register, unregister };