function copyHighlight(element) {
    element.classList.add("copy-highlight");
    setTimeout(() => element.classList.remove("copy-highlight"), 500);
}
function copySimpleReference(element, uuid, name) {
    navigator.clipboard.writeText(uuid);
    copyHighlight(element);
}
async function resolveReference() {
    try {

        const data = await navigator.clipboard.readText();
        return data;

    }
    catch(error) {
        return null;
    }
}

export { copyHighlight, copySimpleReference, resolveReference };