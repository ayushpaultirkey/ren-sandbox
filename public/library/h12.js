/**
    * H12 component class
    * @description
    * * Client version: `v2.2.0`
    * * Transform version required: `v2.2.0`
    * * Github: https://github.com/ayushpaultirkey/h12
*/
export default class H12 {

    constructor() {

        /**
            * The unique identifier for the component. 
            * This ID is automatically generated using `H12.raid()` and should not be manually updated or changed 
            * after the component is rendered.
            * 
            * @type {string}
        */
        this.id = H12.raid();

         /**
            * The root element associated with this component.
            * 
            * @type {Element}
        */
        this.root = null;

        /**
            * Arguments passed to the component, which can be used to initialize or configure the component.
            * This object can store any data passed during initialization.
            * 
            * @type {any}
        */
        this.args = {};

         /**
            * The parent component of this instance.
            * This is used to refer to the component's parent within a hierarchical structure.
            * 
            * @type {H12}
        */
        this.parent = null;

        /**
            * A collection of child components.
            * The keys in this object represent identifiers, and the values are instances of child components (`H12`).
            * 
            * @type {Object<string, H12>}
        */
        this.child = {};

        /**
            * A collection of unique elements associated with this component.
            * 
            * @type {Object<string, Element>}
        */
        this.element = {};

        /**
            * A key-value pairs with setter functions for each key.
            * Alternatively, the `set()` function can be used to update values.
            * 
            * Note: The setter functions do not support appending via "++" (i.e., "{key}++").
            * 
            * @type {Object<string, function(value: any): void>}
            * 
            * @example
            * const { age } = this.key;
            * age(23);
            * // Equivalent to
            * this.set("{age}", 23);
        */
        this.key = {};

    }

    /**
        * A private object used to store bindings for the component.
        * - `element`: An array of elements associated with the binding.
        * - `data`: Data of the key.
        * - For text bindings, the `type` will be `0`.
        * - For element bindings, the `type` will be `1`.
        * - For attribute bindings, the `type` will be `2`.
        * 
        * @private
        * @type {Object<string, { element: Array<{ node: Element | Text, type: 0 | 1 | 2, parent?: Element, clone?: Element[], name?: string, map?: string }>, data: string }>}
    */
    #binding = {};

    /**
        * Adds a binding for the specified key with the associated data.
        * If the key doesn't already exist in the `#binding` object, it is initialized with an empty `element` array.
        * 
        * - For text bindings, the `type` will be `0`.
        * - For element bindings, the `type` will be `1`.
        * - For attribute bindings, the `type` will be `2`.
        * 
        * @private
        * @param {string} key - The key for the binding.
        * @param {{ node: Element | Text, type: 0 | 1 | 2, parent?: Element, clone?: Element[], name?: string, map?: string }} data - The data to be bound to the key.
    */
    #bind(key, data) {

        if (!this.key[key]) this.key[key.split("{")[1].split("}")[0]] = (value) => this.set(key, value);

        if (!this.#binding[key]) this.#binding[key] = { element: [], data: "" };
        this.#binding[key].element.push(data);

    }

    /**
        * This function is called after the component is built and ready to be rendered.
        * 
        * @param {*} args - The arguments passed by the `pre()` function. Alternatively, 
        * these can be accessed via `this.args`.
        * 
        * @example
        * async main(args = {}) {
        *   this.set("{color}", "red");
        * }
    */
    main(args = {}, callback) {}

    /**
        * Creates a render template for the element.
        * 
        * @returns {Element | null} The rendered element or `null` if rendering fails.
        * 
        * @example
        * // Example usage:
        * render() {
        *   return <>
        *       <div>Hello world</div>
        *   </>;
        * }
        * 
        * // This will be converted to:
        * render() {
        *   return this.node("div", ["Hello world"]);
        * }
    */
    render() {
        return this.node("div");
    }

    /**
        * This function is called after the component is rendered. 
        * It only works on the root component; child components do not call this function.
        * To use this, you can register a dispatcher event.
        *
        * @example
        * async finally(args = {}) {
        *   console.log(this.id, "loaded!");
        * }
    */
    finally() {}

    /**
        * Prepares the component for rendering and initializes the values.
        * 
        * @param {string} element - The query selector of the element.
        * @param {*} args - The arguments to be passed while creating the component.
        * @returns {Element|null} A promise that resolves to the initialized element or `null` if initialization fails.
        * 
        * @example
        * const app = new App();
        * app.pre(".root");
    */
    init(element = null, args = {}) {

        try {

            this.root = this.render();
            this.#unique("id", this.element);

            if (this.args.child instanceof Element) {
                this.set("{child}", this.args.child);
            }

            this.main(args);

            if (element) {
                document.querySelector(element).appendChild(this.root);
                this.finally();
            }

            return this.root;
            
        }
        catch(error) {
            console.error(error);
        };


    }

    /**
        * The node along with its attributes, children and keys.
        *
        * @typedef {Object} Node
        * @param {string} type - The name of the element or component to create.
        * @param {string[]} children - An array of child elements or strings to include as content.
        * @param {Object.<string, {value: string, keys: string[]}>} attributes - An object of attribute with their value and kets.
        * @param {string[]} keys - An array of keys for bindings, used when the current element's text, not its children.
        * @returns {Element} The created element.
        * 
        * @example
        * this.node("div", ["Hello world"]);
        * this.node("div", ["Hello {name}"], {}, [ "{name}" ]);
        * this.node("div", ["Hello world"], { class: { value: "bg-red-500" } });
        * this.node("div", ["Hello world"], { class: { value: "bg-{color}-500", keys: ["color"] } });
        * this.node("div", ["Hello world"], { onclick: { value: () => {} } });
    */
    node(type = "", children = [], attributes = {}, keys = [], svg = false) {

        const element = svg ? document.createElementNS("http://www.w3.org/2000/svg", type) : document.createElement(type);

        children.forEach(child => {

            const type = typeof(child);
            if (type === "string") {

                const textNode = document.createTextNode(child);
                element.append(textNode);

                if (!keys || !keys.includes(child)) return;

                this.#bind(child, { node: textNode, type: 0, parent: textNode.parentNode, clone: [] });

            }
            else {
                element.append(type === "function" ? child.bind(this)() : child);
            }

        });

        Object.entries(attributes).forEach(([attribute, { keys, value }]) => {

            if (keys) keys.forEach(key => this.#bind(key, { node: element, type: 2, name: attribute, map: value }));
    
            if (typeof value === "function") {
                attribute.startsWith("on") ? element.addEventListener(attribute.slice(2), value.bind(this)) : element.setAttribute(attribute, value());
            }
            else {
                element.setAttribute(attribute, value);
            }
            
        });

        return element;

    }

    /**
        * Creates and initializes a child component, passing arguments and associating it with a parent.
        * 
        * @param {H12} node - The class constructor of the component to instantiate.
        * @param {Array<Element> | Function} children - An array of child elements for the child component.
        * @param {any} args - Arguments to be passed to the child component during initialization.
        * 
        * @returns {H12 | undefined} An initialized component or `undefined` if no valid node is provided.
    */
    component(node = null, children = [], args = {}) {
        if (node instanceof Object) {
            
            const id = args.id;
            const component = new node();

            component.id = id || component.id;
            component.args = { ... args, child: children[0] };
            component.parent = this;

            this.child[id || component.id] = component;
            return component.init(null, args);

        }
    }

    /**
        * Checks if the provided value is of a valid type.
        * Valid types are: `string`, `number`, `boolean`, and `function`.
        *
        * @private
        * @param {*} value - The value to check.
        * @returns {boolean} `true` if the value is of a valid type; otherwise, `false`.
        *
        * @example
        * this.#isValidType("Hello"); // true
        * this.#isValidType(42); // true
        * this.#isValidType(false); // true
        * this.#isValidType(() => {}); // true
        * this.#isValidType([]); // false
    */
    #isValidType(value) {
        return ["string", "number", "boolean", "function"].includes(typeof(value));
    }

    /**
        * Updates the key's value and modifies any elements containing the corresponding key placeholders.
        * 
        * If the key has "++" at the end (e.g., `{item}++`), the value will be appended to the existing value.
        * Similarly, if "++" is placed before the key (e.g., `++{item}`), the value will be prepended to the existing value.
        * 
        * Note: If the value type changes (for example, if the current value is text and the new value is an element),
        * the old value will be replaced instead of being appended due to type incompatibility.
        * 
        * @param {string} key - The key that corresponds to the placeholder in the elements.
        * @param {string | Element | Function} value - The value to be set or the function to generate the value.
        * 
        * @example
        * 
        * this.set("{item}", "Red"); // value = Red
        * this.set("{item}++", "Apple"); // value = Red Apple
        * this.set("++{item}", "Fresh"); // value = Fresh Red Apple
        * this.set("{item}", <><i>Banana</i></>); // value = Banana
    */
    set(key = "", value = "") {
        
        const index = key.indexOf("++");
        key = key.replace("++", "");
        
        const mapping = this.#binding[key];

        if (!mapping) return;

        const fValue = typeof(value) === "function" ? value() : value;

        const elements = mapping.element;
        elements.forEach(element => {

            const node = element.node;
            const parent = element.parent || node.parentNode;

            if(element.type == 0) {
                if (value instanceof Element) {
                    parent.replaceChild(value, node);
                    element.type = 1;
                    element.node = value;
                }
                else if (this.#isValidType(value)) {
                    node.nodeValue = index < 0 ? fValue : (index === 0 ? fValue + node.nodeValue : node.nodeValue + fValue);
                }
            }
            else if(element.type == 1) {
                if (value instanceof Element) {
                    if (index !== -1) {
                        node.insertAdjacentElement((index == 0) ? "afterbegin" : "beforeend", value);
                        element.clone.push(value);
                        return;
                    }
                    else {
                        parent.replaceChild(value, node);
                        element.node = value;
                    }
                }
                else if (this.#isValidType(value)) {
                    const textNode = document.createTextNode(fValue);
                    parent.replaceChild(textNode, node);
                    element.type = 0;
                    element.node = textNode;
                }
                element.clone.forEach(x => {
                    x.remove();
                });
                element.clone = [];
            }
            else if(element.type == 2 && this.#isValidType(value)) {
                let elementMapping = element.map;
                let keyMatch = elementMapping.match(/\{[^{}\s]*\}/gm);
                if (keyMatch) {
                    keyMatch.forEach(keyFound => {
                        if (keyFound === key) {
                            elementMapping = elementMapping.replace(keyFound, value);
                        }
                        else {
                            const subKeyBinding = this.#binding[keyFound];
                            if (subKeyBinding) elementMapping = elementMapping.replace(keyFound, subKeyBinding.data);
                        }
                    });
                }
                node.setAttribute(element.name, elementMapping);
                this.#binding[key].data = value;
            }

        });

    }

    /**
        * Get the value of the key.
        * 
        * Note: This method may not always be reliable.
        * 
        * @param {string} key 
        * @returns { any | null }
    */
    get(key = "") {
        return this.#binding[key]?.data || null;
    }

    /**
        * Ensures that elements with the given unique attribute are stored in a specified object,
        * and updates the attribute to a new random value.
        * 
        * @param {string} - The attribute name used to identify unique elements.
        * @param {Object} - The object where elements are stored, indexed by their `unique` attribute values.
        * 
        * @example
        * // Store all elements with a "id" attribute in `this.elements`
        * this.#unique("id", this.elements);
    */
    #unique(unique = "id", store = this.element) {
        this.root.querySelectorAll(`[${unique}]`).forEach(x => {
            store[x.getAttribute(unique)] = x;
            x.setAttribute(unique, "x" + H12.raid());
        });
    }
    /**
        * Generates a random string to be used as a new unique identifier.
        * 
        * @returns {string} A random string.
    */
    static raid() {
        return Math.random().toString(36).slice(6);
    }

};