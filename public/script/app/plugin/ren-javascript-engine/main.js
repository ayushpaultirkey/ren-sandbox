import { register as execRegister, unregister as execUnregister } from "./editor/node/execution.js";
import { register as valueRegister, unregister as valueUnregister } from "./editor/node/value.js";

function register() {
    execRegister();
    valueRegister();
}
function unregister() {
    execUnregister();
    valueUnregister();
}

export { register, unregister };