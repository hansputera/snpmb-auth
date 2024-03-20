import assert from 'node:assert';
import isGitDirty from 'is-git-dirty';

const isDirty = isGitDirty();

assert.notEqual(isDirty, null);
assert.notEqual(isDirty, false);
assert.ok(isDirty);
