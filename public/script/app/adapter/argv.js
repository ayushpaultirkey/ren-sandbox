import { ARGV_HANDLER } from "@config/handler.js";
import { getHandler } from "@handler/manager.js";

async function getArguments() {
    try {
        const { getArguments: hGetArguments } = await getHandler(ARGV_HANDLER);
        return hGetArguments( ... arguments );
    }
    catch(error) {
        console.error(error);
    }
}

export { getArguments };