import { promisify } from "node:util";
import { exec as _exec } from "node:child_process";

const nodeExec = promisify(_exec);

/**
 * Executes a shell command and returns the result
 * @param {string} cmd 
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
export async function exec(cmd) {
    try {
        return await nodeExec(cmd);
    } catch (err) {
        return err;
    }
}