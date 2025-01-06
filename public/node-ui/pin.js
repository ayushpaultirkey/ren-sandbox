import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/h12/dispatcher";

import { IPin } from "../node/pin";

class UIPin extends H12 {
    constructor() {
        
        super();

        this.links = [];

        this.ipin = null;

    }
    main() {

    }
    render() {

        this.ipin = this.args.iobject;

        const title = this.args.title || "title";
        return <>
            <span>
                <button id="btn" class="text-green-500 px-1 border border-green-500" onclick={ this.clearLinks } onmouseleave={ this.removeActiveHoverPin } onmouseover={ this.createActiveHoverPin } onmousedown={ this.createActivePin }>{ title }</button>
            </span>
        </>;

    }

    clearLinks() {

        if(this.ipin.type != IPin.TYPES.INPUT) return;
        dispatcher.call("clearLinkedPins", this);

    }
    removeLinks() {

        this.links.forEach(link => {
            link.remove();
        });
        this.links = [];
        
    }


    getUINode() {
        return this.parent;
    }

    getIPin() {
        return this.ipin;
    }
    getIUUID() {
        return this.ipin.getUUID();
    }
    
    addLink(link) {
        this.links.push(link);
    }

    createActiveHoverPin() {
        if(this.ipin.type == IPin.TYPES.INPUT) {
            dispatcher.call("createActiveHoverPin", this);
        }
    }
    
    removeActiveHoverPin() {
        if(this.ipin.type == IPin.TYPES.INPUT) {
            dispatcher.call("removeActiveHoverPin", this);
        }
    }

    createActivePin(event) {

        if(this.ipin.type !== IPin.TYPES.OUTPUT) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        const reference = this;
        const pin = this.root;

        if(pin) {

            dispatcher.call("createHelperLine", reference);
            dispatcher.call("createActivePin", reference);
    
            window.addEventListener("mousemove", onDragMove);
            window.addEventListener("mouseup", onDragStop);

            function onDragMove(event) {

                event.stopPropagation();
                event.preventDefault();

                dispatcher.call("updateHelperLine", { pin: reference, event: event });
        
            };
    
            function onDragStop(event) {

                event.stopPropagation();
                event.preventDefault();
        
                window.removeEventListener("mousemove", onDragMove);
                window.removeEventListener("mouseup", onDragStop);
    
                dispatcher.call("removeHelperLine", reference);
                dispatcher.call("removeActivePin", reference);
        
            };
    
        }


    }



}

export { UIPin }