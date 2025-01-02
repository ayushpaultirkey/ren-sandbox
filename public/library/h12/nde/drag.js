function Drag(element = null, handle = null, node = null) {

    handle.addEventListener('mousedown', onDragDown);

    function onDragDown(event) {

        // event.stopPropagation();
        // event.preventDefault();

        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragStop);

        let previousX = event.clientX;
        let previousY = event.clientY;

        function onDragMove(event) {

            // event.stopPropagation();
            // event.preventDefault();
    
            let currentX = previousX - event.clientX;
            let currentY = previousY - event.clientY;
    
            const size = element.getBoundingClientRect();
    
            element.style.left = size.left - currentX + 'px';
            element.style.top = size.top - currentY + 'px';
    
            previousX = event.clientX;
            previousY = event.clientY;
    
        };

        function onDragStop(event) {

            // event.stopPropagation();
            // event.preventDefault();
    
            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('mouseup', onDragStop);
    
        };

    };

};

export default Drag;