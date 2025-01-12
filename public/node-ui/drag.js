import VIEWPORT from "./viewport";

function Drag(element = null, handle = null, parent = null, isFrame = false) {

    if (!element || !handle || !parent) return;

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

            let newX = (event.clientX - parentRect.left - offsetX) / (isFrame ? 1 : scale);
            let newY = (event.clientY - parentRect.top - offsetY) / (isFrame ? 1 : scale);

            if(!isFrame) {
                newX = Math.max(0, Math.min(newX, VIEWPORT.size.width - width / scale)); 
                newY = Math.max(0, Math.min(newY, VIEWPORT.size.height - height / scale)); 
            }

            element.style.position = "absolute";
            element.style.left = newX + "px";
            element.style.top = newY + "px";

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
