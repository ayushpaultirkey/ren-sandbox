function Drag(element = null, handle = null) {
    if (!element || !handle) return;

    handle.addEventListener("mousedown", onDragDown);

    function onDragDown(event) {

        event.stopPropagation();
        event.preventDefault();

        const parent = element.parentElement;
        const parentRect = parent.getBoundingClientRect();

        const elementRect = element.getBoundingClientRect();

        let offsetX = event.clientX - elementRect.left;
        let offsetY = event.clientY - elementRect.top;

        window.addEventListener("mousemove", onDragMove);
        window.addEventListener("mouseup", onDragStop);

        function onDragMove(event) {

            event.stopPropagation();
            event.preventDefault();

            let newX = event.clientX - parentRect.left - offsetX;
            let newY = event.clientY - parentRect.top - offsetY;

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
