import { Dispatcher } from "@library/h12/dispatcher";

/** @type {Dispatcher} */
const dispatcher = new Dispatcher();
console.warn("Event handler initialized");

export { dispatcher };