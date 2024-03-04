import { mkdirp } from "mkdirp";
import { writeFile, unlink } from "node:fs/promises";
import { basename, dirname } from "node:path";
import { getDiffCommand, getTmpDirPath } from "./config.js";
import { exec } from "./exec.js";

export class File {
    /** 
     * @type string|null 
     */
    path = null;

    /**
     * @type string|null
     */
    content = null;

    /** 
     * Writes the new file content on disk 
     * @param {string|null} path If set, the file will be saved at the given path (for this time only)
     */
    async save(path = null) {
        const p = path ?? this.path;
        if (this.content === null) {
            try {
                await unlink(p);
            } catch (err) {
                if (err.code !== "ENOENT") throw err;
            }
            return;
        }

        const dirPath = dirname(p);
        await mkdirp(dirPath);
        await writeFile(p, this.content);
    }

    /**
     * Writes the new file content in a temporary folder, runs a diff command and returns the diff
     * @returns {Promise<string>}
     */
    async diff() {
        const tmpDir = `${await getTmpDirPath()}/diff`;
        const tmpPath = tmpDir + "/" + basename(this.path);

        await this.save(tmpPath);
        const cmd = await getDiffCommand(this.path, tmpPath);
        const { stdout } = await exec(cmd);
        return stdout;
    }
}
