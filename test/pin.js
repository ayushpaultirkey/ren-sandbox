import { Data } from "./data.js";

class Pin extends Data {
    constructor(outer, value = 0) {
        super(null, outer);
        this.pin = null;
        this.value = value;
    }
}

export { Pin };