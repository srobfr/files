import { exec } from "./exec.js";
import { tmpdir } from "node:os";

let folderDiffCachedResult = null;

/**
 * Returns the diff command to use to obtain a folder diff.
 * @param {string} originalDir
 * @param {string} modifiedDir
 * @returns {Promise<string>}
 */
export async function getFolderDiffCommand(originalDir, modifiedDir) {
    if (folderDiffCachedResult) return folderDiffCachedResult;

    const commands = [
        // The diff commands to try, in the preference order

        [ // Custom, using DIR env var
            async () => !!process.env.DIFF, // Just check if the var is empty
            `${process.env.DIFF} '${originalDir}' '${modifiedDir}'`,
        ],

        [
            async () => await exec('command -v meld'),
            `meld '${originalDir}' '${modifiedDir}'`,
        ],

        [
            async () => await exec('command -v colordiff'),
            `colordiff -ru '${originalDir}' '${modifiedDir}'`,
        ],

        [ // This one should be pretty standard
            async () => await exec('command -v diff'),
            `diff -ru '${originalDir}' '${modifiedDir}'`,
        ],
    ];

    for (const [check, cmd] of commands) {
        try {
            if (!await check()) continue;
            folderDiffCachedResult = cmd;
            return cmd;
        } catch (err) {
            continue;
        }
    }
}

let diffCachedResult = null;

/**
 * Returns the diff command to use to obtain a folder diff.
 * @param {string} original
 * @param {string} modified
 * @returns {Promise<string>}
 */
export async function getDiffCommand(original, modified) {
    if (diffCachedResult) return diffCachedResult;

    const commands = [
        // The diff commands to try, in the preference order

        [ // Custom, using DIR env var
            async () => !!process.env.DIFF, // Just check if the var is empty
            `${process.env.DIFF} '${original}' '${modified}'`,
        ],

        [
            async () => await exec('command -v meld'),
            `meld '${original}' '${modified}'`,
        ],

        [
            async () => await exec('command -v colordiff'),
            `colordiff -u '${original}' '${modified}'`,
        ],

        [ // This one should be pretty standard
            async () => await exec('command -v diff'),
            `diff -u '${original}' '${modified}'`,
        ],
    ];

    for (const [check, cmd] of commands) {
        try {
            if (!await check()) continue;
            diffCachedResult = cmd;
            return cmd;
        } catch (err) {
            continue;
        }
    }
}

/**
 * Returns the temporary folder's path. Used to obtain diffs using diff commands.
 * @returns {Promise<string>}
 */
export async function getTmpDirPath() {
    return process.env.TMP_DIR ?? tmpdir();
}
