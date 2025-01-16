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

class Dispatcher  {
    
    #listeners = new Map();

    on(event, listener) {
        if(!this.#listeners.has(event)) {
            this.#listeners.set(event, []);
        }
        this.#listeners.get(event).push(listener);
    }
    off(event, listener) {
        if(this.#listeners.has(event)) {
            this.#listeners.set(event, this.#listeners.get(event).filter((l) => l !== listener));
        }
    }
    emit(event, ...args) {
        if(this.#listeners.has(event)) {
            this.#listeners.get(event).forEach((listener) => listener(...args));
        }
    }
    once(event, listener) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            listener(...args);
        };
        this.on(event, wrapper);
    }
    clear(event) {
        if(this.#listeners.has(event)) {
            this.#listeners.delete(event);
            console.warn(`Event ${event} cleared`);
        }
    }
    clearAll() {
        this.#listeners.clear();
        console.warn("Event handler cleared");
    }
}

export { Dispatcher }
