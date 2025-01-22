import H12 from "@library/h12";

class Icon extends H12 {
    constructor() {
        super();
    }
    render() {

        const w = this.args.width || "24px";
        const h = this.args.height || "24px";
        const path = this.args.path;

        return <>
            <svg style={ `width: ${w}; height: ${h};` } viewBox="0 0 24 24" class={ this.args.class || "" }>
                <path svg d={ path } />
            </svg>
        </>;
    }
}

export { Icon };