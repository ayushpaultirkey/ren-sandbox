import "@style/main.css";
import H12 from "@library/h12";
import { IProperty } from "../node/property.js";
import { PRIMITIVE_TYPES } from "../node/types/default.js";

class UIProperty extends H12 {

    /** @type {IProperty} */
    #iproperty = null;
    get iproperty() {
        return this.#iproperty;
    }

    constructor() {
        super();
    }
    
    main() {
        this.setValue(this.#iproperty.value);
    }

    field() {
        return <>
            <textarea id="box" rows="1" cols="10" class="-mt-[1px] w-full text-xs bg-zinc-700 px-1 text-zinc-400 rounded-sm" oninput={ this.update }></textarea>
        </>
    }
    render() {
        
        if(!this.args.iobject) return <><label>Invalid property</label></>;
        this.#iproperty = this.args.iobject;


        const name = this.#iproperty.name || this.#iproperty.meta.displayName;

        return <>
            <div class="flex flex-col w-full">
                <label style="font-size: 10px;" class="text-zinc-400 text-opacity-80">{ name }:</label>
                <div class="flex flex-row w-full">
                    { this.field() }
                    { this.args.child || "" }
                </div>
            </div>
        </>;

    }
    update() {
        this.#iproperty.value = this.element.box.value;
    }
    getValue() {
        return this.element.box.value;
    }
    setValue(value) {
        this.element.box.value = value;
    }
}


class FloatValue extends UIProperty {
    constructor() {
        super();
    }
    field() {
        return <>
            <input type="number" id="box" size="5" step="0.01" class="-mt-[1px] w-full text-xs bg-zinc-700 px-1 text-zinc-400 rounded-sm" value="0" oninput={ this.update } />
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
        this.iproperty.value = value;
    }
    getValue() {
        return this.element.box.value;
    }
    setValue(value) {
        this.element.box.value = value;
    }
}

class StringValue extends UIProperty {
    constructor() {
        super();
    }
    field() {

        // const custom = this.ivalue.custom;

        // if(custom) {
        //     if(custom.dropdown) {

        //         const options = custom.dropdownOptions();
        //         const fields = [];

        //         options.forEach(option => {
        //             fields.push(<>
        //                 <option value={ option }>{ option }</option>
        //             </>);
        //         });

        //         return <>
        //             <select id="box" onchange={ this.update } onclick={ this.setOptions }>
        //                 { ... fields }
        //             </select>
        //         </>;

        //     }
        // }

        return <>
            <textarea id="box" rows="1" cols="10" class={ `-mt-[1px] w-full text-xs bg-zinc-700 px-1 text-zinc-400 rounded-sm resize-none` } oninput={ this.update }></textarea>
        </>;

    }
    update() {
        let value = this.element.box.value;
        this.iproperty.value = value;
    }
    getValue() {
        return this.element.box.value;
    }
    setValue(value) {
        this.element.box.value = value;
    }
}



const PROPERTY_REGISTRY = {
    [PRIMITIVE_TYPES.FLOAT]: FloatValue,
    [PRIMITIVE_TYPES.STRING]: StringValue
}

export { UIProperty, PROPERTY_REGISTRY };