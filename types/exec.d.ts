/**
 * Executes a shell command and returns the result
 * @param {string} cmd
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
export function exec(cmd: string): Promise<{
    stdout: string;
    stderr: string;
}>;
