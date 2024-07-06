/**
 * Returns a new context
 */
export function newContext(): {
    diffAll: () => Promise<Array<string>>;
    folderDiff: (withCopy?: boolean) => Promise<string>;
    interactiveFolderDiff: (withCopy?: boolean) => Promise<void>;
    load: (path: string) => Promise<File>;
    processCmdArgs: () => Promise<void>;
    saveAll: () => Promise<void>;
};
import { File } from "./File.js";
/**
 * Gets a diff for all the loaded files
 * @returns {Promise<Array<string>>}
 */
export function diffAll(): Promise<Array<string>>;
/**
 * Saves all files under a given path in a temporary folder, runs a folder diff command and returns the output
 * @argument {boolean} withCopy If true, the compared folder will first be copied to the tmp one. Use with caution on huge folders!
 * @returns {Promise<string>}
 */
export function folderDiff(withCopy?: boolean): Promise<string>;
/**
 * Saves all files under a given path in a temporary folder and runs an interactive folder diff command
 * @argument {boolean} withCopy If true, the compared folder will first be copied to the tmp one. Use with caution on huge folders!
 * @returns {Promise<void>}
 */
export function interactiveFolderDiff(withCopy?: boolean): Promise<void>;
/**
 * Loads a file in the given context
 * @param {string} path
 * @returns {Promise<File>}
 */
export function load(path: string): Promise<File>;
export function processCmdArgs(): Promise<void>;
/**
 * Saves all the loaded files
 * @returns {Promise<void>}
 */
export function saveAll(): Promise<void>;
