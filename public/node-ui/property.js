import "@style/main.css";
import H12 from "@library/h12";
import { IValue } from "../node/property";

class UIValue extends H12 {
    constructor() {
        super();
        this.ivalue = null;
    }
    main() {

        const value = this.ivalue.getValue();
        this.setValue(value);

    }
    render() {
        
        if(!this.args.iobject) return <><label>Invalid property</label></>;
        this.ivalue = this.args.iobject;

        const name = this.ivalue.getName() || this.ivalue.getMeta().displayName;

        return <>
            <div class="flex flex-col">
                <label style="font-size: 10px;" class="text-zinc-400">{ name }:</label>
                <textarea id="box" rows="1" cols="10" class="-mt-[1px] text-xs bg-zinc-700 px-1 text-zinc-400 rounded-sm" oninput={ this.updateValue }></textarea>
            </div>
        </>;

    }
    updateValue() {

        let value = this.element.box.value;
        value = isNaN(value) ? 0 : (value * 1);
        this.ivalue.setValue(value);

    }
    getValue() {
        return this.element.box.value;
    }
    setValue(value) {
        this.element.box.value = value;
    }
}

export { UIValue }