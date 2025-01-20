const localStorage = window.localStorage;

function readFile(path) {
    return localStorage.getItem(path);
}

function writeFile(path, data) {
    localStorage.setItem(path, data);
    return true;
}

function readDirectory() {
    
    const files = [];

    for(let i = 0, len = window.localStorage.length; i < len; i++) {
        const key = window.localStorage.key(i);
        const isFile = key.indexOf(".") !== -1;
        if(isFile) {
            files.push({
                name: key,
                type: "file"
            })
        }
    }

    return files;

}

export { readFile, writeFile, readDirectory };