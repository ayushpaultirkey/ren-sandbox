import { dispatcher } from "@script/dispatcher";

function register() {

    console.warn("registered");
    dispatcher.emit("add-menu", "explorer-menu", "Explorer", {
        "Open": () => { console.log("Open Graph Set"); },
    });

}
function unregister() {
    
    console.warn("unregistered");
    dispatcher.emit("remove-menu", "explorer-menu");

}


export { register, unregister };