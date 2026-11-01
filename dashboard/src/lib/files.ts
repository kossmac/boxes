/** The directory in the box that the file route serves, and where the agent session starts. */
const WORKSPACE_DIR = '/workspace';

/**
 * The URL that serves the bytes of one workspace file, with a content type from its name.
 *
 * @param boxId The id of the box.
 * @param path The workspace-relative path of the file.
 * @returns The URL path.
 */
export function fileUrl(boxId: string, path: string): string {
  return `/api/boxes/${encodeURIComponent(boxId)}/files/raw?path=${encodeURIComponent(path)}`;
}

/**
 * Finds the workspace file that a URL in a message names.
 *
 * An absolute path in the workspace and a relative path name a file. A relative
 * path starts from the workspace, because the agent session starts there. A
 * URL with a scheme, a fragment, a query or any other absolute path names no
 * workspace file. The fragment and the query after a path are dropped.
 *
 * @param url The URL from the message.
 * @returns The workspace-relative path, or null when the URL names no workspace file.
 */
export function workspacePath(url: string): string | null {
  const path = url.replace(/[?#].*$/s, '');
  // A colon before the first slash starts a scheme.
  if (path === '' || /^[^/]*:/.test(path)) return null;

  let relative: string;
  if (path.startsWith(`${WORKSPACE_DIR}/`)) {
    relative = path.slice(WORKSPACE_DIR.length + 1);
  } else if (path.startsWith('/')) {
    return null;
  } else {
    relative = path.replace(/^(\.\/)+/, '');
  }

  try {
    relative = decodeURIComponent(relative);
  } catch {
    // A stray percent sign stays as it is.
  }
  return relative === '' ? null : relative;
}
