import VIEWPORT from "./viewport";

function Drag(element = null, handle = null, parent = null, isFrame = false) {

    if (!element || !handle || !parent) return;

    const gridSize = 10;

    handle.addEventListener("mousedown", onDragDown);

    function onDragDown(event) {

        event.stopPropagation();
        event.preventDefault();

        const scale = VIEWPORT.zoom;
        const parentRect = parent.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        let offsetX = event.clientX - elementRect.left;
        let offsetY = event.clientY - elementRect.top;

        window.addEventListener("mousemove", onDragMove);
        window.addEventListener("mouseup", onDragStop);

        function onDragMove(event) {

            event.stopPropagation();
            event.preventDefault();

            let width = elementRect.width;
            let height = elementRect.height;

            // Calculate new positions
            let rawX = (event.clientX - parentRect.left - offsetX) / (isFrame ? 1 : scale);
            let rawY = (event.clientY - parentRect.top - offsetY) / (isFrame ? 1 : scale);

            // Snap to grid
            let snappedX = Math.round(rawX / gridSize) * gridSize;
            let snappedY = Math.round(rawY / gridSize) * gridSize;

            if (!isFrame) {
                snappedX = Math.max(0, Math.min(snappedX, VIEWPORT.size.width - width / scale));
                snappedY = Math.max(0, Math.min(snappedY, VIEWPORT.size.height - height / scale));
            }

            element.style.position = "absolute";
            element.style.left = snappedX + "px";
            element.style.top = snappedY + "px";

        }

        function onDragStop(event) {
            
            event.stopPropagation();
            event.preventDefault();

            window.removeEventListener("mousemove", onDragMove);
            window.removeEventListener("mouseup", onDragStop);

        }
    }
}

export default Drag;
