import "@style/main.css";
import H12 from "@library/h12";
import { IPin } from "../node/pin";

class UIPin extends H12 {
    constructor() {
        
        super();

        this.links = [];
        this.maxLinks = 1;

    }
    render() {
        const title = this.args.title || "title";
        return <>
            <span>
                <button class="text-green-500 px-1 border border-green-500">{ title }</button>
            </span>
        </>;
    }
}

export { UIPin }