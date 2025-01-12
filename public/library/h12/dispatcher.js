const targets = new EventTarget();
const handlers = new Set(); // Using a Set to manage handler objects

const dispatcher = {
    /**
        * Binds an event listener to a specified event name.
        * @param {string} name - The name of the event to listen for.
        * @param {Function} callback - The callback function to execute when the event is triggered.
    */
    bind(name = "", callback) {
        if (name && callback) {

            const wrappedCallback = (event) => {
                callback(event, event.detail);
            };

            handlers.add({ name, callback, wrappedCallback });
            targets.addEventListener(name, wrappedCallback);

        }
    },

    /**
        * Unbinds an event listener from a specified event name.
        * @param {string} name - The name of the event to remove.
        * @param {Function} callback - The original callback function to remove.
    */
    unbind(name = "", callback) {
        if (name && callback) {
            for (const handler of handlers) {
                if (handler.name === name && handler.callback === callback) {
                    targets.removeEventListener(name, handler.wrappedCallback);
                    handlers.delete(handler); // Remove from Set
                    break;
                }
            }
        }
    },

    /**
        * Dispatches an event of specified name with optional arguments.
        * @param {string} name - The name of the event to dispatch.
        * @param {any} argument - The data to pass as `detail` in the event.
    */
    call(name = "", argument) {
        if (name) {
            targets.dispatchEvent(new CustomEvent(name, { detail: argument }));
        }
    }
};

export default dispatcher;
