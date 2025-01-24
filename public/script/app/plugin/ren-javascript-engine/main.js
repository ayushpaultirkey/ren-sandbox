import { register as eventRegister, unregister as eventUnregister } from "./editor/node/event.js";
import { register as valueRegister, unregister as valueUnregister } from "./editor/node/value.js";
import { register as funcRegister, unregister as funcUnregister } from "./editor/node/function.js";
import { register as devRegister, unregister as devUnregister } from "./editor/node/development.js";
import { register as timeRegister, unregister as timeUnregister } from "./editor/node/timer.js";
import { register as mathRegister, unregister as mathUnregister } from "./editor/node/math.js";
import { register as refRegister, unregister as refUnregister } from "./editor/node/reference.js";

function register() {
    eventRegister();
    valueRegister();
    funcRegister();
    devRegister();
    timeRegister();
    mathRegister();
    refRegister();
}
function unregister() {
    eventUnregister();
    valueUnregister();
    funcUnregister();
    devUnregister();
    timeUnregister();
    mathUnregister();
    refUnregister();
}

export { register, unregister };