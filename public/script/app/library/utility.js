function copyHighlight(element) {
    element.classList.add("copy-highlight");
    setTimeout(() => element.classList.remove("copy-highlight"), 500);
}

export { copyHighlight };