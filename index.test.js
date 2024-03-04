import assert from 'node:assert';
import { resolve } from 'node:path';
import test from 'node:test';
import { load, newContext } from './index.js';

test("files", async t => {
    await test("load", async t => {
        const file = await load("./package.json");
        assert.equal(file.path, resolve("./package.json"));
        assert(file.content?.match(/"name": "@srob\/files"/))
    });

    await test("loadInexistantFile", async t => {
        const file = await load(`/tmp/nonExistentFile-${Math.random()}`);
        assert.strictEqual(file.content, null);
    });

    await test("loadInContext", async t => {
        const path = `/tmp/nonExistentFile-${Math.random()}`;
        const fileInGlobalContext = await load(path);
        const sameFile = await load(path);
        assert.strictEqual(fileInGlobalContext, sameFile);

        {
            const { load } = newContext();
            const file = await load(path);
            assert.notStrictEqual(fileInGlobalContext, file);
        }
    });

    await test("folderDiff", async t => {
        const { load, folderDiff } = newContext();
        const file1 = await load(`/tmp/a/b/file1.txt`);
        file1.content = "Test1";
        await file1.save();

        const file2 = await load(`/tmp/a/b/file2.txt`);
        file2.content = "Test2";
        await file2.save();
        file2.content = "Foo bar :)\n";

        const diff = await folderDiff();
        console.debug(diff);
    });

    await test("folderDiffWithCopy", async t => {
        const { load, folderDiff } = newContext();
        const file1 = await load(`/tmp/a/b/file1.txt`);
        file1.content = "Test1";
        await file1.save();

        const file2 = await load(`/tmp/a/b/file2.txt`);
        file2.content = "Test2";
        await file2.save();
        file2.content = "Foo bar :)\n";

        const diff = await folderDiff(true);
        console.debug(diff);
    });

    await test("diff", async t => {
        const { load } = newContext();
        const file = await load(`/tmp/a/b/file.txt`);
        file.content = "Test original\n";
        await file.save();

        file.content = "Test modifié\n";

        const diff = await file.diff();
        console.debug(diff);
    });

    await test("unlink nonexistent file", async t => {
        const { load } = newContext();
        const file = await load(`/tmp/non-existent.file`);
        file.content = null;
        await file.save();
    });
})
