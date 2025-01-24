import { mdiAbacus, mdiBug, mdiCardBulletedOutline, mdiContentSave, mdiPackageUp, mdiPlay, mdiPlusThick } from "@mdi/js";
import { Icon } from "@script/app/control/icon.js";
import { Property, PropertyMenu, PropertyTab } from "../../layout/property.js";
import { GraphSetTab, NodeListTab } from "./main-property.js";

class SideMenu extends PropertyMenu {
    constructor() {
        super();
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
                <button title="Debug">
                    <Icon args path={ mdiBug }></Icon>
                </button>
                <button title="Export">
                    <Icon args path={ mdiPackageUp }></Icon>
                </button>
                <button title="Save">
                    <Icon args path={ mdiContentSave }></Icon>
                </button>
            </div>
        </>
    }
}

class MainProperty extends Property {

    constructor() {
        super();
    }

    template() {
        return <>
            <div>
                <node args alias={ NodeListTab } id="nodeList"></node>
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
                b
            </div>
        </>
    }
}

export { SideMenu, MainProperty, SubProperty };