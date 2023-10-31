import { File } from "./File.js";
import { readFile, stat } from "node:fs/promises";
import { getFolderDiffCommand, getTmpDirPath } from "./config.js";
import { dirname, resolve } from "node:path";
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
        // First, get the common (existing) parent dir of all the files in the context
        const filesPaths = Object.keys(context);
        let longestCommonDir = (
            filesPaths.length > 1
                ? commonPathPrefix(filesPaths).replace(/\/$/, '')
                : dirname(filesPaths[0])
        );

        while (longestCommonDir.length > 0) {
            try {
                await stat(longestCommonDir);
                break;
            } catch (err) {
                if (err.code === "ENOENT") longestCommonDir = dirname(longestCommonDir);
                else throw err;
            }
        }

        const tmpDir = `${await getTmpDirPath()}/folderDiff`;
        await exec(`rm -rf '${tmpDir}'`); // Just in case

        // Then, save all the files under the tmp folder
        for (const file of Object.values(context)) {
            const tmpPath = tmpDir + file.path.substring(longestCommonDir.length);
            await file.save(tmpPath);
        }

        const cmd = await getFolderDiffCommand(longestCommonDir, tmpDir);
        const { stdout } = await exec(cmd);
        return stdout;
    }

    /**
     * Gets a diff for all the loaded files
     * @returns {Promise<Array<string>>}
     */
    async function diffAll() {
        const files = Object.values(context)
        const diffs = [];
        for (const file of files) diffs.push(await file.diff());
        return diffs;
    }

    /**
     * Saves all the loaded files
     * @returns {Promise<void>}
     */
    async function saveAll() {
        const files = Object.values(context)
        for (const file of files) await file.save();
    }

    return {
        diffAll,
        folderDiff,
        load,
        saveAll,
    };
}

// Initialize a global context for convenience
const {
    diffAll,
    folderDiff,
    load,
    saveAll,
} = newContext();

export {
    diffAll,
    folderDiff,
    load,
    saveAll,
};
