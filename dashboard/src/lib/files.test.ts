import assert from 'node:assert/strict';
import { test } from 'vitest';
import { fileUrl, workspacePath } from './files.ts';

test('a workspace file is fetched by its path, from its box', () => {
  assert.equal(
    fileUrl('abc123', '.boxes/attachments/shot.png'),
    '/api/boxes/abc123/files/raw?path=.boxes%2Fattachments%2Fshot.png',
  );
});

test('an absolute path in the workspace and a relative path name a workspace file', () => {
  assert.equal(workspacePath('/workspace/docs/chart.png'), 'docs/chart.png');
  assert.equal(workspacePath('docs/chart.png'), 'docs/chart.png');
  assert.equal(workspacePath('./chart.png'), 'chart.png');
  // The markdown parser encodes a space in a URL.
  assert.equal(workspacePath('my%20chart.png'), 'my chart.png');
  assert.equal(workspacePath('notes.md#usage'), 'notes.md');
});

test('a URL that is not a path in the workspace names no file', () => {
  for (const url of [
    'https://example.com/chart.png',
    'mailto:someone@example.com',
    'data:image/png;base64,AAAA',
    '#usage',
    '?page=2',
    '/tmp/chart.png',
    '/home/agent/chart.png',
    '//example.com/chart.png',
    '/workspace',
    '/workspace/',
  ]) {
    assert.equal(workspacePath(url), null, url);
  }
});
