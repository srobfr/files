export class File {
    /**
     * @type string|null
     */
    path: string | null;
    /**
     * @type string|null
     */
    content: string | null;
    /**
     * Writes the new file content on disk
     * @param {string|null} path If set, the file will be saved at the given path (for this time only)
     */
    save(path?: string | null): Promise<void>;
    /**
     * Writes the new file content in a temporary folder, runs a diff command and returns the diff
     * @returns {Promise<string>}
     */
    diff(): Promise<string>;
}
