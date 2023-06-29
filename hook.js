import isGitDirty from 'is-git-dirty';
import assert from 'node:assert';

const isDirty = isGitDirty();

assert.notEqual(isDirty, null);
assert.notEqual(isDirty, false);
assert.ok(isDirty);
