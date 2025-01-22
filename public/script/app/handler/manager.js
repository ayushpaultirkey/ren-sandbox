const handlers = new Map();

async function getHandler(handler) {
    if(handlers.has(handler)) {
        return handlers.get(handler);
    }
    else {
        const module = await import(`../handler/${handler.path}/${handler.file}.js`);
        handlers.set(handler, module);
        console.warn(`Handler ${JSON.stringify(handler)} loaded`);
        return module;
    };
};

export { getHandler };