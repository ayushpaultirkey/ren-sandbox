const handlers = new Map();

async function getHandler(handler) {
    if(handlers.has(handler)) {
        return handlers.get(handler);
    }
    else {
        const module = await import(`../handler/${handler}`);
        handlers.set(handler, module);
        console.warn(`Handler ${handler} loaded`);
        return module;
    };
};

export { getHandler };