import "@style/main.css";
import H12 from "@library/h12";
import { IValue } from "../node/property";
import { PRIMITIVE_TYPES } from "../node/type/types";

class UIValue extends H12 {
    constructor() {
        super();
        this.ivalue = null;
    }
    main() {

        const value = this.ivalue.getValue();
        this.setValue(value);

    }
    wrapper() {
        return <>
            <textarea id="box" rows="1" cols="10" class="-mt-[1px] text-xs bg-zinc-700 px-1 text-zinc-400 rounded-sm" oninput={ this.update }></textarea>
        </>
    }
    render() {
        
        if(!this.args.iobject) return <><label>Invalid property</label></>;
        this.ivalue = this.args.iobject;

        const name = this.ivalue.getName() || this.ivalue.getMeta().displayName;

        return <>
            <div class="flex flex-col">
                <label style="font-size: 10px;" class="text-zinc-400 text-opacity-80">{ name }:</label>
                { this.wrapper() }
            </div>
        </>;

    }
    update() {
        let value = this.element.box.value;
        this.ivalue.setValue(value);
    }
    getValue() {
        return this.element.box.value;
    }
    setValue(value) {
        this.element.box.value = value;
    }
}


class FloatValue extends UIValue {
    constructor() {
        super();
    }
    wrapper() {
        return <>
            <input type="number" id="box" size="5" step="0.01" class="-mt-[1px] w-24 text-xs bg-zinc-700 px-1 text-zinc-400 rounded-sm" value="0" oninput={ this.update } />
        </>
    }
    update() {
        let value = this.element.box.value;
        if(!isNaN(value)) {
            value = parseFloat(value);
        }
        else {
            value = 0;
        }
        this.ivalue.setValue(value);
    }
    getValue() {
        return this.element.box.value;
    }
    setValue(value) {
        this.element.box.value = value;
    }
}

class StringValue extends UIValue {
    constructor() {
        super();
    }
    wrapper() {
        const isMultiline = this.ivalue.multiline;
        return <>
            <textarea id="box" rows="1" cols="10" class={ `-mt-[1px] text-xs bg-zinc-700 px-1 text-zinc-400 rounded-sm ${isMultiline ? "" : "resize-none" }` } oninput={ this.update }></textarea>
        </>
    }
    update() {
        let value = this.element.box.value;
        this.ivalue.setValue(value);
    }
    getValue() {
        return this.element.box.value;
    }
    setValue(value) {
        this.element.box.value = value;
    }
}



const VALUE_REGISTRY = {
    [PRIMITIVE_TYPES.FLOAT]: FloatValue,
    [PRIMITIVE_TYPES.STRING]: StringValue
}

export { UIValue, VALUE_REGISTRY };