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
        this.setValue(this.#iproperty.value);

        // const { control } = this.child;
        // control.setValue(this.#iproperty.value);
        // control.dispatcher.on("onUpdated", (value) => {
        //     this.#iproperty.value = value;
        // });

    }
    render() {

        if(!this.args.iobject) return <><label>Invalid property</label></>;
        this.#iproperty = this.args.iobject;

        return <>
            <div class={ this.args.class || "" }>
                { this.template() }
            </div>
        </>;

    }
    template() {
        return "";
    }
    updateValue() {
        this.#iproperty.value = value;
    }
    setValue(value) {

    }
}


class StringValue extends UIProperty {
    constructor() {
        super();
    }
    template() {
        return <>
            <input id="textbox" type="text" class="primary-input w-full h-full" oninput={ this.updateValue } />
        </>;
    }
    setValue(value) {
        const { textbox } = this.element;
        textbox.value = value;
    }
    updateValue() {
        const { textbox } = this.element;
        this.iproperty.value = textbox.value;
    }
}

class FloatValue extends StringValue {
    constructor() {
        super();
    }
    template() {
        return <>
            <input id="textbox" type="number" class="primary-input w-full h-full" oninput={ this.updateValue } />
        </>;
    }
}




const PROPERTY_REGISTRY = {
    [PRIMITIVE_TYPES.FLOAT]: FloatValue,
    [PRIMITIVE_TYPES.STRING]: StringValue
}

export { UIProperty, PROPERTY_REGISTRY };