import VIEWPORT from "../config/viewport.js";

class ZoomHandler {

    #target = null;
    #handler = null;
    #touchStartHandler = null;
    #touchMoveHandler = null;
    #lastDistance = null;

    constructor(target) {
        this.#target = target;
        this.#handler = this.#zoom.bind(this);
        this.#touchStartHandler = this.#onTouchStart.bind(this);
        this.#touchMoveHandler = this.#onTouchMove.bind(this);
    }

    register() {

        if(!this.#target) {
            console.error("ZoomHandler: Invalid target element");
            return;
        }
        this.#target.addEventListener("mousewheel", this.#handler);
        this.#target.addEventListener("touchstart", this.#touchStartHandler, { passive: false });
        this.#target.addEventListener("touchmove", this.#touchMoveHandler, { passive: false });
    
    }

    unregister() {

        if(!this.#target) {
            console.error("ZoomHandler: Invalid target element");
            return;
        }
        this.#target.removeEventListener("mousewheel", this.#handler);
        this.#target.removeEventListener("touchstart", this.#touchStartHandler);
        this.#target.removeEventListener("touchmove", this.#touchMoveHandler);

    }

    onZoom() {}

    #zoom(event) {

        event.stopPropagation();
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

        this.onZoom();

    }

    #onTouchStart(event) {

        if(event.touches.length === 2) {

            event.preventDefault();

            const [touch1, touch2] = event.touches;
            this.#lastDistance = this.#calculateDistance(touch1, touch2);

        }
    }

    #onTouchMove(event) {

        if(event.touches.length === 2) {
            event.preventDefault();

            const [touch1, touch2] = event.touches;
            const currentDistance = this.#calculateDistance(touch1, touch2);

            if(this.#lastDistance !== null) {
                const zoomDelta = (currentDistance - this.#lastDistance) / 200;

                const newZoom = Math.min(
                    Math.max(VIEWPORT.zoom + zoomDelta, VIEWPORT.zoomMin),
                    VIEWPORT.zoomMax
                );

                const rect = this.#target.getBoundingClientRect();
                const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
                const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

                const scaleDelta = newZoom / VIEWPORT.zoom;

                const offsetX = centerX - centerX * scaleDelta;
                const offsetY = centerY - centerY * scaleDelta;

                this.#target.style.transform = `scale(${newZoom})`;
                this.#target.style.left = `${(parseFloat(this.#target.style.left || 0) || 0) + offsetX}px`;
                this.#target.style.top = `${(parseFloat(this.#target.style.top || 0) || 0) + offsetY}px`;

                VIEWPORT.zoom = newZoom;

                this.onZoom();
            }

            this.#lastDistance = currentDistance;
            
        }
    }

    #calculateDistance(touch1, touch2) {
        const deltaX = touch2.clientX - touch1.clientX;
        const deltaY = touch2.clientY - touch1.clientY;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
}

export { ZoomHandler };
