import { mdiAbacus, mdiBug, mdiCardBulletedOutline, mdiContentSave, mdiPackageUp, mdiPlay, mdiPlusThick } from "@mdi/js";
import { Icon } from "@script/app/control/icon.js";
import { Property, PropertyMenu, PropertyTab } from "../../layout/property.js";
import { GraphSetTab, GraphTab, NodeListTab } from "./tab.js";

class SideMenu extends PropertyMenu {
    constructor() {
        super();
        this.workspace = null;
    }
    main() {

        this.workspace = this.relay["workspace"];

    }
    template() {
        return <>
            <div>
                <button title="Node List" onclick={ () => { this.switchTab("nodeList") } }>
                    <Icon args path={ mdiCardBulletedOutline }></Icon>
                </button>
                <button title="Properties" onclick={ () => { this.switchTab("graphSet") } }>
                    <Icon args path={ mdiAbacus }></Icon>
                </button>
                <button title="Run" class="hidden">
                    <Icon args path={ mdiPlay }></Icon>
                </button>
                <button title="Debug" onclick={ () => { this.debug() } }>
                    <Icon args path={ mdiBug }></Icon>
                </button>
                <button title="Export" onclick={ () => { this.export() } }>
                    <Icon args path={ mdiPackageUp }></Icon>
                </button>
                <button title="Save" onclick={ () => { this.save() } }>
                    <Icon args path={ mdiContentSave }></Icon>
                </button>
            </div>
        </>
    }
    save() {
        if(!this.workspace) return;
        this.workspace.save();
    }
    debug() {
        if(!this.workspace) return;
        this.workspace.debug();
    }
    export() {
        if(!this.workspace) return;
        this.workspace.export();
    }
}

class MainProperty extends Property {

    constructor() {
        super();
    }

    template() {
        return <>
            <div>
                <node args alias={ NodeListTab } id="nodeList" class="hidden"></node>
                <graph args alias={ GraphSetTab } id="graphSet"></graph>
            </div>
        </>
    }

}

class SubProperty extends Property {
    constructor() {
        super();
    }
    template() {
        return <>
            <div>
                <graph args alias={ GraphTab }></graph>
            </div>
        </>
    }
}

export { SideMenu, MainProperty, SubProperty };