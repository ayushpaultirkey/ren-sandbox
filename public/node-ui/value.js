import "@style/main.css";
import H12 from "@library/h12";
import { IValue } from "../node/property";
import { PRIMITIVE_TYPES } from "../node/types/default";

class UIValue extends H12 {
    constructor() {
        super();
        this.ivalue = null;
    }
    main() {

        const value = this.ivalue.getValue();
        this.setValue(value);

    }
    field() {
        return <>
            <textarea id="box" rows="1" cols="10" class="-mt-[1px] text-xs bg-zinc-700 px-1 text-zinc-400 rounded-sm" oninput={ this.update }></textarea>
        </>
    }
    render() {
        
        if(!this.args.iobject) return <><label>Invalid property</label></>;
        this.ivalue = this.args.iobject;

        const name = this.ivalue.getName() || this.ivalue.getMeta().displayName;

        return <>
            <div class="flex flex-col w-full">
                <label style="font-size: 10px;" class="text-zinc-400 text-opacity-80">{ name }:</label>
                { this.field() }
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
    field() {
        return <>
            <input type="number" id="box" size="5" step="0.01" class="-mt-[1px] text-xs bg-zinc-700 px-1 text-zinc-400 rounded-sm" value="0" oninput={ this.update } />
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
    field() {

        const custom = this.ivalue.custom;

        if(custom) {
            if(custom.dropdown) {

                const options = custom.dropdownOptions();
                const fields = [];

                options.forEach(option => {
                    fields.push(<>
                        <option value={ option }>{ option }</option>
                    </>);
                });

                return <>
                    <select id="box" onchange={ this.update } onclick={ this.setOptions }>
                        { ... fields }
                    </select>
                </>;

            }
        }

        return <>
            <textarea id="box" rows="1" cols="10" class={ `-mt-[1px] text-xs bg-zinc-700 px-1 text-zinc-400 rounded-sm resize-none` } oninput={ this.update }></textarea>
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
        const custom = this.ivalue.custom;
        this.element.box.value = value;
    }
}



const VALUE_REGISTRY = {
    [PRIMITIVE_TYPES.FLOAT]: FloatValue,
    [PRIMITIVE_TYPES.STRING]: StringValue
}

export { UIValue, VALUE_REGISTRY };