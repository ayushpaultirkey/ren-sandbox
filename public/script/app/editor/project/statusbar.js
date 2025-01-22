import H12 from "@library/h12.js";

class StatusBar extends H12 {
    constructor() {
        super();
        this.listener = null;
    }
    main() {

        const { position } = this.key;
        this.listener = (event) => {
            position(`x: ${event.clientX}, y: ${event.clientY}`)
        };
        window.addEventListener("mousemove", this.listener);

    }
    render() {
        return <>
            <div class="text-xs text-zinc-400 font-semibold flex flex-row justify-end select-none">
                <label class="p-1 px-2 hover:bg-zinc-600">{position}</label>
            </div>
        </>;
    }
    destroy() {
        window.removeEventListener("mousemove", this.listener);
        super.destroy();
    }
}

export { StatusBar };