import { FS_HANDLER } from "@config/handler";
import { getHandler } from "@handler/manager";

async function readFile() {
    try {
        const { readFile } = await getHandler(FS_HANDLER);
        return readFile( ... arguments );
    }
    catch(error) {
        console.error(error);
    };
};

async function writeFile() {
    try {
        const { writeFile } = await getHandler(FS_HANDLER);
        return writeFile( ... arguments );
    }
    catch(error) {
        console.error(error);
    };
};

export { readFile, writeFile };