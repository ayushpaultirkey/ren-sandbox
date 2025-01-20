import { join } from "path";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import h12vite from "./plugin/h12.vite";

export default defineConfig({
    root: join(__dirname, "/public"),
    build: {
        outDir: "../dist"
    },
    optimizeDeps: {
        entries: [
            "public/script/app.js",
        ]
    },
    plugins: [
        h12vite()
    ],
    resolve: {
        alias: [
            { find: "@library", replacement: fileURLToPath(new URL("./public/library", import.meta.url)) },
            { find: "@script", replacement: fileURLToPath(new URL("./public/script", import.meta.url)) },
            { find: "@style", replacement: fileURLToPath(new URL("./public/style", import.meta.url)) },
            { find: "@vm", replacement: fileURLToPath(new URL("./public/node", import.meta.url)) },
            { find: "@editor", replacement: fileURLToPath(new URL("./public/script/editor", import.meta.url)) },
            { find: "@project", replacement: fileURLToPath(new URL("./public/script/editor/project", import.meta.url)) },
            { find: "@adapter", replacement: fileURLToPath(new URL("./public/adapter", import.meta.url)) },
            { find: "@handler", replacement: fileURLToPath(new URL("./public/handler", import.meta.url)) },
            { find: "@config", replacement: fileURLToPath(new URL("./public/config", import.meta.url)) },
        ]
    },
    css: {
        postcss: {
            plugins: [
                tailwindcss(),
                autoprefixer()
            ],
        },
    },
})