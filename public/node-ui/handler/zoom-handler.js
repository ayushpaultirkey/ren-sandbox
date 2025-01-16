import VIEWPORT from "../viewport.js";

class ZoomHandler {

    #target = null;
    #handler = null;

    constructor(target) {
        this.#target = target;
        this.#handler = this.zoom.bind(this);
    }
    register() {

        if(!this.#target) {
            console.error("ZoomHandler: Invalid target element");
            return;
        }

        this.#target.addEventListener("mousewheel", this.#handler);

    }
    unregister() {

        if(!this.#target) {
            console.error("ZoomHandler: Invalid target element");
            return;
        }
        this.#target.removeEventListener("mousewheel", this.#handler);

    }

    zoom(event) {
        event.preventDefault();
    
        const root = this.#target;
        const rect = root.getBoundingClientRect();
    
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        const zoomDelta = event.deltaY > 0 ? -0.05 : 0.05;
    
        const newZoom = Math.min(
            Math.max(VIEWPORT.zoom + zoomDelta, VIEWPORT.zoomMin),
            VIEWPORT.zoomMax
        );
    
        const scaleDelta = newZoom / VIEWPORT.zoom;
    
        const offsetX = mouseX - mouseX * scaleDelta;
        const offsetY = mouseY - mouseY * scaleDelta;
    
        root.style.transform = `scale(${newZoom})`;
        root.style.left = `${(parseFloat(root.style.left || 0) || 0) + offsetX}px`;
        root.style.top = `${(parseFloat(root.style.top || 0) || 0) + offsetY}px`;
    
        VIEWPORT.zoom = newZoom;
    
        //dispatcher.call("onZoom", VIEWPORT.zoom);
    }
    zoomIn() {
        VIEWPORT.zoom = (VIEWPORT.zoom + 0.1) > VIEWPORT.zoomMax ? VIEWPORT.zoomMax : VIEWPORT.zoom + 0.05;
        this.#target.style.transform = `scale(${VIEWPORT.zoom})`;
        //dispatcher.call("onZoom", VIEWPORT.zoom);
    }
    zoomOut() {
        VIEWPORT.zoom -= (VIEWPORT.zoom - 0.1) < VIEWPORT.zoomMin ? 0 : 0.05;
        this.#target.style.transform = `scale(${VIEWPORT.zoom})`;
        //dispatcher.call("onZoom", VIEWPORT.zoom);
    }
}

export { ZoomHandler };