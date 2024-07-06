/**
 * Returns the diff command to use to obtain a folder diff.
 * @param {string} originalDir
 * @param {string} modifiedDir
 * @returns {Promise<string>}
 */
export function getFolderDiffCommand(originalDir: string, modifiedDir: string): Promise<string>;
/**
 * Returns the diff command to use to obtain an interactive folder diff.
 * @param {string} originalDir
 * @param {string} modifiedDir
 * @returns {Promise<string>}
 */
export function getInteractiveFolderDiffCommand(originalDir: string, modifiedDir: string): Promise<string>;
/**
 * Returns the diff command to use to obtain a folder diff.
 * @param {string} original
 * @param {string} modified
 * @returns {Promise<string>}
 */
export function getDiffCommand(original: string, modified: string): Promise<string>;
/**
 * Returns the temporary folder's path. Used to obtain diffs using diff commands.
 * @returns {Promise<string>}
 */
export function getTmpDirPath(): Promise<string>;
