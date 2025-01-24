import { readFile, writeFile } from "@script/app/adapter/fs.js";

async function getPlugins() {

    const plugins = await readFile("plugins");
    if(plugins) {
        return JSON.parse(plugins);
    };
    const defaultPlugins = [ "ren-workspace", "explorer", "ren-javascript-engine" ];
    await writeFile("plugins", JSON.stringify(defaultPlugins));
    return defaultPlugins;

};

async function loadPlugins() {

    const plugins = await getPlugins();

    for(const plugin of plugins) {
        const { register } = await import(`./plugin/${plugin}/main.js`);
        register();
    };

};

export { getPlugins, loadPlugins };