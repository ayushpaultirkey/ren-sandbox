import "@style/main.css";
import H12 from "@library/h12";
import { PRIMITIVE_TYPES } from "@vm/types/default.js";
import { Control, InputBox } from "../../../../../editor/control.js";

class UIProperty extends H12 {

    /** @type {import("@vm/property.js").IProperty} */
    #iproperty = null;

    get iproperty() {
        return this.#iproperty;
    }

    constructor() {
        super();
        this.control = Control;
        this.controlProperties = {};
    }
    main() {

        if(!this.#iproperty) return;

        const { control } = this.child;
        control.setValue(this.#iproperty.value);
        control.dispatcher.on("onUpdated", (value) => {
            this.#iproperty.value = value;
        });

    }
    render() {

        if(!this.args.iobject) return <><label>Invalid property</label></>;
        this.#iproperty = this.args.iobject;

        const title = this.#iproperty.name || this.#iproperty.meta.displayName;

        return <>
            <control args property={ this.controlProperties } alias={ this.control } title={ title } id="control">
                { this.args.child || "" }
            </control>
        </>;

    }
}


class FloatValue extends UIProperty {
    constructor() {
        super();
        this.control = InputBox;
        this.controlProperties = { type: "number" };
    }
    // main() {
    //     if(!this.iproperty) return;
    //     const { control } = this.child;
    //     control.setValue(this.iproperty.value);
    //     control.dispatcher.on("onUpdated", (value) => {
    //         this.parent.addOutputSocket(crypto.randomUUID(), "dyn");
    //         this.iproperty.value = value;
    //     });
    // }
}

class StringValue extends UIProperty {
    constructor() {
        super();
        this.control = InputBox;
    }
    // main() {
    //     if(!this.iproperty) return;
    //     const { control } = this.child;
    //     control.setValue(this.iproperty.value);
    //     control.dispatcher.on("onUpdated", (value) => {
    //         this.parent.addOutputSocket(crypto.randomUUID(), "dyn");
    //         this.iproperty.value = value;
    //     });
    // }
}



const PROPERTY_REGISTRY = {
    [PRIMITIVE_TYPES.FLOAT]: FloatValue,
    [PRIMITIVE_TYPES.STRING]: StringValue
}

export { UIProperty, PROPERTY_REGISTRY };