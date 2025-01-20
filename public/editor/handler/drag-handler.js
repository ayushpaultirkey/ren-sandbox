import VIEWPORT from "../viewport.js";

class DragHandler {

    #target = null;
    #handle = null;
    #parent = null

    #handler = null;

    #targetBound = null;
    #parentBound = null;

    constructor(target, handle, parent) {
        this.#target = target;
        this.#handle = handle;
        this.#parent = parent;
        this.#handler = this.#onDragStart.bind(this);
        this.gridSize = 10;
        this.isFrame = false;
    }
    register() {

        if(!this.#handle || !this.#target || !this.#parent) {
            console.error("DragHandler: Invalid target element");
            return;
        }
        this.#saveBound();
        this.#handle.addEventListener("mousedown", this.#handler);

    }
    unregister() {

        if(!this.#handle || !this.#target || !this.#parent) {
            console.error("DragHandler: Invalid target element");
            return;
        }
        this.#saveBound();
        this.#handle.removeEventListener("mousedown", this.#handler);

    }

    #saveBound() {
        this.#targetBound = this.#target.getBoundingClientRect();
        this.#parentBound = this.#parent.getBoundingClientRect();
    }
    lastBound() {
        return {
            target: this.#targetBound,
            parent: this.#parentBound
        }
    }

    onDragEnd() {}

    #onDragStart(event) {

        event.stopPropagation();
        event.preventDefault();

        const target = this.#target;
        const parent = this.#parent;

        const parentRect = parent.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        const offsetX = event.clientX - targetRect.left;
        const offsetY = event.clientY - targetRect.top;

        const onDragMove = (event) => {

            event.stopPropagation();
            event.preventDefault();

            let width = targetRect.width;
            let height = targetRect.height;

            let rawX = (event.clientX - parentRect.left - offsetX) / (this.isFrame ? 1 : VIEWPORT.zoom);
            let rawY = (event.clientY - parentRect.top - offsetY) / (this.isFrame ? 1 : VIEWPORT.zoom);

            let snappedX = Math.round(rawX / this.gridSize) * this.gridSize;
            let snappedY = Math.round(rawY / this.gridSize) * this.gridSize;

            if (!this.isFrame) {
                snappedX = Math.max(0, Math.min(snappedX, VIEWPORT.size.width - width / VIEWPORT.zoom));
                snappedY = Math.max(0, Math.min(snappedY, VIEWPORT.size.height - height / VIEWPORT.zoom));
            }

            target.style.left = snappedX + "px";
            target.style.top = snappedY + "px";

        }

        const onDragStop = (event) => {
            
            event.stopPropagation();
            event.preventDefault();

            window.removeEventListener("mousemove", onDragMove);
            window.removeEventListener("mouseup", onDragStop);

            this.#targetBound = target.getBoundingClientRect();
            this.#parentBound = parent.getBoundingClientRect();

            this.onDragEnd();

        }

        window.addEventListener("mousemove", onDragMove);
        window.addEventListener("mouseup", onDragStop);

    }
}

export { DragHandler };