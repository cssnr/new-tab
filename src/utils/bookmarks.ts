export async function getBookmarkFolders() {
  const folders: chrome.bookmarks.BookmarkTreeNode[] = []
  function logFolders(nodes: chrome.bookmarks.BookmarkTreeNode[]): void {
    nodes.forEach((node) => {
      if (node.children) {
        // console.log('folder:', node.title)
        if (node.title) folders.push(node)
        // recurse into children
        logFolders(node.children)
      }
    })
  }

  const tree = await chrome.bookmarks.getTree()
  logFolders(tree)
  return folders
}
