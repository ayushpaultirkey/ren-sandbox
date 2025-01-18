import "@style/main.css";
import H12 from "@library/h12";
import { Dispatcher } from "@library/h12/dispatcher";

class Control extends H12 {
    constructor() {
        super();
        this.dispatcher = new Dispatcher();
    }
    control() {
        return "";
    }
    render() {
        const title =  this.args.title || "Title";
        return <>
            <div class="flex flex-col w-full">
                <label class="text-xs font-semibold text-zinc-400 text-opacity-80">{ title }:</label>
                <div class="flex flex-row w-full">
                    { this.control() }
                    { this.args.child || "" }
                </div>
            </div>
        </>;
    }
    getProperty(prop) {
        if(this.args.property) {
            return this.args.property[prop];
        }
    }
    getValue() {}
    setValue(value) {}
    onUpdate() {}

    destroy() {
        this.dispatcher.clearAll();
        super.destroy();
    }

}

class Label extends Control {
    constructor() {
        super();
    }
    control() {
        return <>
            <label>{value}</label>
        </>
    }
    setValue(value) {
        this.set("{value}", value);
    }
}
class Button extends Control {
    constructor() {
        super();
    }

    render() {
        const title =  this.args.title || "Title";
        return <>
            <button onclick={ this.args.onclick } class="bg-zinc-700 border border-zinc-900 border-opacity-70 hover:bg-zinc-600 active:bg-zinc-700 text-xs rounded-sm px-2 py-1 font-semibold text-zinc-400">{ title }</button>
        </>;
    }
}

class InputBox extends Control {
    constructor() {
        super();
    }
    control() {

        const type = this.args.type || this.getProperty("type") || "text";

        return <>
            <input id="textbox" type={ type } class={ `primary-input w-full` } oninput={ this.onUpdate } />
        </>

    }
    onUpdate() {
        this.dispatcher.emit("onUpdated", this.element.textbox.value);
    }
    getValue() {
        return this.element.textbox.value;
    }
    setValue(value) {
        this.element.textbox.value = value;
    }
}

class MultilineTextBox extends InputBox {
    constructor() {
        super();
    }
    control() {
        return <>
            <textarea id="textbox" rows="1" cols="10" class={ `w-full text-xs bg-zinc-700 py-1 px-2 text-zinc-400 rounded-sm` } oninput={ this.onUpdate }></textarea>
        </>
    }
}

export { Control, Label, Button, InputBox, MultilineTextBox };