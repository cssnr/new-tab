import { openDB, IDBPDatabase } from 'idb'

const DB_NAME = 'wallpaper'
const DB_VERSION = 1
const STORE_NAME = 'items'

export interface WallpaperData {
  id?: number
  url?: string
  data: Blob
  selected?: boolean // multi-select capable

  // [key: string]: unknown
}

const dbPromise: Promise<IDBPDatabase> = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    //noinspection FallThroughInSwitchStatementJS
    switch (oldVersion /* NOSONAR */) {
      case 0: /* NOSONAR */ {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        })

        // Only index what you actually query
        store.createIndex('url', 'url', { unique: false })
        store.createIndex('selected', 'selected', { unique: false })
        break
      }
      // case 1:
      //   console.log('future upgrade logic')
    }
  },
})

export function useWallpaperDB() {
  const wallpaperDBChannel = new BroadcastChannel('wallpaperDB')

  async function addWallpaper(entry: Omit<WallpaperData, 'id'>) {
    const db = await dbPromise
    const result = await db.add(STORE_NAME, entry)
    wallpaperDBChannel.postMessage('change')
    return result
  }

  // helper: store from URL
  async function addFromUrl(url: string) {
    const response = await fetch(url)
    const blob = await response.blob()
    return addWallpaper({ url, data: blob })
  }

  // AI RETARDED
  async function addImage(data: Blob): Promise<IDBValidKey> {
    return addWallpaper({ data })
  }
  async function addImageWithUrl(url: string, data: Blob): Promise<IDBValidKey> {
    return addWallpaper({ url, data })
  }

  async function getAll(): Promise<WallpaperData[]> {
    const db = await dbPromise
    return db.getAll(STORE_NAME)
  }

  async function getById(id: number) {
    const db = await dbPromise
    return db.get(STORE_NAME, id)
  }

  async function getByUrl(url: string) {
    const db = await dbPromise
    return db.getFromIndex(STORE_NAME, 'url', url)
  }

  async function getSelected(): Promise<WallpaperData[]> {
    const db = await dbPromise

    const all = await db.getAll(STORE_NAME)
    // console.log(
    //   all.map((w) => ({ id: w.id, selected: w.selected, type: typeof w.selected })),
    // )
    return all.filter((w) => w.selected)
    // return db.getAllFromIndex(STORE_NAME, 'selected', true)
    // return db.getAllFromIndex(STORE_NAME, 'selected', IDBKeyRange.only(true))
    // return db.getAllFromIndex(STORE_NAME, 'selected', IDBKeyRange.only(true))
    // return db.getAllFromIndex(STORE_NAME, 'selected', true)
  }

  async function toggleSelected(id: number) {
    const db = await dbPromise
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const item = await store.get(id)
    // console.log(`toggleSelected: ${id}:`, item)
    if (item) {
      item.selected = !item.selected
      await store.put(item)
      wallpaperDBChannel.postMessage('change')
    }
    await tx.done
  }

  async function deleteId(id: number) {
    const db = await dbPromise
    await db.delete(STORE_NAME, id)
    wallpaperDBChannel.postMessage('change')
  }

  return {
    addWallpaper,
    addFromUrl,
    getAll,
    addImage,
    addImageWithUrl,
    getById,
    getByUrl,
    getSelected,
    toggleSelected,
    deleteId,
    wallpaperDBChannel,
  }
}
