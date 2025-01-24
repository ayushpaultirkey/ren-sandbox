import H12 from "@library/h12.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "@vm/types/default.js";
import { Control, InputBox } from "../../../../control.js";
import { Icon } from "@script/app/control/icon.js";
import { mdiRefresh } from "@mdi/js";

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
        this.build();
        this.refresh();

        // const { control } = this.child;
        // control.setValue(this.#iproperty.value);
        // control.dispatcher.on("onUpdated", (value) => {
        //     this.#iproperty.value = value;
        // });

    }
    refresh() {
        this.setValue(this.#iproperty.value);
    }
    build() {}
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
            <input id="valueBox" type="text" oninput={ this.updateValue } ondblclick={ (e) => { this.paste(); } } class="primary-input w-full h-full" placeholder="Value" />
        </>;
    }
    setValue(value) {
        const { valueBox } = this.element;
        valueBox.value = value;
    }
    updateValue() {
        const { valueBox } = this.element;
        this.iproperty.value = valueBox.value;
    }
    async paste() {

        const value = await navigator.clipboard.readText();
        this.setValue(value);
        this.updateValue();

    }
}

class FloatValue extends StringValue {
    constructor() {
        super();
    }
    template() {
        return <>
            <input id="valueBox" type="number" oninput={ this.updateValue } ondblclick={ (e) => { this.paste(); } } class="primary-input w-full h-full" placeholder="Value" />
        </>;
    }
}

class IntegerValue extends StringValue {
    constructor() {
        super();
    }
    template() {
        return <>
            <input id="valueBox" type="number" oninput={ this.updateValue } ondblclick={ (e) => { this.paste(); } } class="primary-input w-full h-full" placeholder="Value" />
        </>;
    }
}

class ReferenceValue extends StringValue {
    constructor() {
        super();
    }
    template() {
        return <>
            <input id="valueBox" type="text" oninput={ this.updateValue } ondblclick={ (e) => { this.paste(); } } class="primary-input w-full h-full" placeholder="Value" />
        </>;
    }
}




const PROPERTY_REGISTRY = {
    [PRIMITIVE_TYPES.FLOAT]: FloatValue,
    [PRIMITIVE_TYPES.INTEGER]: IntegerValue,
    [PRIMITIVE_TYPES.STRING]: StringValue,
    [USER_DEFINED_TYPES.REFERENCE]: ReferenceValue
}

export { UIProperty, PROPERTY_REGISTRY };