import "@style/main.css";
import H12 from "@library/h12";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "../node/types/default";
import { UIValue, VALUE_REGISTRY } from "./value";
import { IValue } from "../node/property";

class UIProperty extends H12 {
    constructor() {
        super();
    }
    main() {

        

    }
    render() {
        
        return <>
            <div class="flex flex-col space-y-1">
                <label class="text-zinc-400 text-sm text-opacity-80" onclick={ this.displayValue }>Values:</label>
                <div class="flex flex-row text-xs bg-zinc-200">
                    <input type="text" id="var_name" placeholder="name" class="bg-transparent w-full px-1" />
                    <select class="bg-transparent" id="var_type">
                        <option>Float</option>
                        <option>Int</option>
                        <option>String</option>
                        <option>Boolean</option>
                        <option>Object</option>
                    </select>
                    <button class="px-1" onclick={ this.add }>add</button>
                </div>
                <div class="space-y-1">
                    {value}
                </div>
            </div>
        </>;

    }
    displayValue() {

        this.igraph = this.parent.getGraph();

        const { value: uiValues } = this.key;

        uiValues("");

        const values = this.igraph.getVariables();
        for(const valueUUID in values) {

            const value = values[valueUUID];
            if(!value) continue;

            const type = value.getType();
            if(!type) continue;

            const valueClass = VALUE_REGISTRY[type];
            if(!valueClass) continue;

            uiValues(<>
                <div class="flex">
                    <property args alias={ valueClass } iobject={ value }></property>
                    <button onclick={ () => { this.remove(valueUUID) } }>&times;</button>
                </div>
            </>, "++x");

        }
        
    }
    remove(valueUUID) {
        
        const graph = this.parent.getGraph();
        const variables = graph.removeVariable(valueUUID);

        this.displayValue();

    }
    add() {

        const graph = this.parent.getGraph();
        const variables = graph.getVariables();

        const { var_name, var_type } = this.element;
        let type = var_type.value.toUpperCase();
        let name = var_name.value;

        const finalType = PRIMITIVE_TYPES[type] || USER_DEFINED_TYPES[type];

        if(variables[name] || !finalType) {
            alert("Variable already exists or invalid type");
            return;
        }

        graph.addVariable(name, finalType);

        this.displayValue();

    }
}
export { UIProperty };