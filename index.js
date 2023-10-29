import { File } from "./File.js";
import { readFile } from "node:fs/promises";
import { getFolderDiffCommand, getTmpDirPath } from "./config.js";
import { resolve } from "node:path";
import { exec } from "./exec.js";
import commonPathPrefix from "common-path-prefix";

/**
 * Returns a new context
 */
export function newContext() {
    /** @type {[path: string]: File} */
    const context = {};

    /**
     * Loads a file in the given context
     * @param {string} path
     * @returns {Promise<File>}
     */
    async function load(path) {
        const absolutePath = resolve(path);
        if ((context[absolutePath]?.content ?? null) !== null) return context[absolutePath];

        let content = null;
        try {
            content = await readFile(absolutePath, { encoding: "utf-8" });
        } catch (err) {
            if (err.code === "ENOENT") content = null;
            else throw (err);
        }

        if (!context[absolutePath]) {
            const file = new File();
            file.path = absolutePath;
            file.content = content;
            context[absolutePath] = file;
        }

        return context[absolutePath];
    }

    /**
     * Saves all files under a given path in a temporary folder, runs a folder diff command and returns the output
     * @returns {Promise<string>}
     */
    async function folderDiff() {
        // First, get the common parent dir of all the files in the context
        const longestCommonDir = commonPathPrefix(Object.keys(context)).replace(/\/$/, '');
        const tmpDir = `${await getTmpDirPath()}/folderDiff`;
        await exec(`rm -rf '${tmpDir}'`); // Just in case

        // Then, save all the files under the tmp folder
        for (const file of Object.values(context)) {
            const tmpPath = tmpDir + "/" + file.path.slice(longestCommonDir.length);
            await file.save(tmpPath);
        }

        const cmd = await getFolderDiffCommand(longestCommonDir, tmpDir);
        const { stdout } = await exec(cmd);
        return stdout;
    }

    return {
        folderDiff,
        load,
    };
}

// Initialize a global context for convenience
const {
    folderDiff,
    load,
} = newContext();

export {
    folderDiff,
    load,
};
