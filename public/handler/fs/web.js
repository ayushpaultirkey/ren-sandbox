const localStorage = window.localStorage;

function readFile(path) {
    return localStorage.getItem(path);
}

function writeFile(path, data) {
    localStorage.setItem(path, data);
    return true;
}

export { readFile, writeFile };