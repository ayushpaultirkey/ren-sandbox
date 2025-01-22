import { FS_HANDLER } from "@config/handler.js";
import { getHandler } from "@handler/manager.js";

async function readFile() {
    try {
        const { readFile: hReadFile } = await getHandler(FS_HANDLER);
        return hReadFile( ... arguments );
    }
    catch(error) {
        console.error(error);
    };
};

async function writeFile() {
    try {
        const { writeFile: hWriteFile } = await getHandler(FS_HANDLER);
        return hWriteFile( ... arguments );
    }
    catch(error) {
        console.error(error);
    };
};

async function readDirectory() {
    try {
        const { readDirectory: hReadDirectory } = await getHandler(FS_HANDLER);
        return hReadDirectory( ... arguments );
    }
    catch(error) {
        console.error(error);
    };
};

export { readFile, writeFile, readDirectory };