# @srobfr/files

Helpers to programmatically edit text files, save, diff, folder-diff, etc.

## Installation

This is a library. You can install it using npm :

```sh
npm install --save @srob/files
```

## Usage

File loading, saving and diff-ing :

```js
// test.mjs
import { load } from "@srob/files";

(async () => {
    // Loads the file content if it exists. If the file does not exist, file.content will be null.
    const file = await load("test.md");

    // Change the content (A)
    file.content = `# Sample file

Initial text
`;

    // Writes the new content in the file
    await file.save();

    // Change the content (B)
    file.content = `# Sample file

This file contains some text.

Last edition date : ${new Date()}
`;

    // Compute and prints the diff between (A) and (B).
    console.log(await file.diff());
})();
```

Running this code with `node test.mjs` will typically print :

```
--- /d/w/bench/test.md	2023-10-29 18:19:44.571108700 +0100
+++ /tmp/diff/test.md	2023-10-29 18:19:44.566022491 +0100
@@ -1,3 +1,5 @@
 # Sample file
 
-Initial text
+This file contains some text.
+
+Last edition date : Sun Oct 29 2023 18:19:44 GMT+0100 (Central European Standard Time)
```

The diff implementation can be changed using the `DIFF` environment variable :

`DIFF="diff" node test.mjs`

```
3c3,5
< Initial text
---
> This file contains some text.
> 
> Last edition date : Sun Oct 29 2023 18:22:47 GMT+0100 (Central European Standard Time)
```

Different `diff` commands are tried, using the first available on your system :

- `$DIFF '<original>' '<modified>'`
- `meld '<original>' '<modified>'`
- `colordiff -u '<original>' '<modified>'`
- `diff -u '<original>' '<modified>'`

## Folder diff

It is possible to get a folder diff when multiple files are loaded :

```js
import { folderDiff, load } from "@srob/files";

(async () => {
    // Load a file in a/b folder
    const file1 = await load("/tmp/a/b/file1.md");
    file1.content = `Last edition date : ${new Date()}
`;
    // Load a file in a/c folder
    const file2 = await load("/tmp/a/c/file2.md");
    file2.content = `Last edition date : ${new Date()}
`;

    // Will print a recursive diff at the common parent folder (a) of all the loaded files
    console.log(await folderDiff());
})();
```

Running this code with `node test.mjs` will typically print :

```
diff -Nru /tmp/a/b/file1.md /tmp/folderDiff/b/file1.md
--- /tmp/a/b/file1.md	1970-01-01 01:00:00.000000000 +0100
+++ /tmp/folderDiff/b/file1.md	2023-10-29 19:00:55.519593897 +0100
@@ -0,0 +1 @@
+Last edition date : Sun Oct 29 2023 19:00:55 GMT+0100 (Central European Standard Time)
diff -Nru /tmp/a/c/file2.md /tmp/folderDiff/c/file2.md
--- /tmp/a/c/file2.md	1970-01-01 01:00:00.000000000 +0100
+++ /tmp/folderDiff/c/file2.md	2023-10-29 19:00:55.519593897 +0100
@@ -0,0 +1 @@
+Last edition date : Sun Oct 29 2023 19:00:55 GMT+0100 (Central European Standard Time)
```
