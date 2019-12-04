class InDB {
  /**
   * const indb = new InDB(options)
   * const store = indb.use(storeName)
   * store.put({ id: 1, name: 'tomy' })
   * @param {object} options {
   *   name: databaseName,
   *   stores: [
   *     {
   *       name: storeName,
   *       keyPath: storeKeyPath,
   *       autoIncrement: false,
   *       indexes: [
   *         {
   *           name: indexName,
   *           keyPath: indexKeyPath,
   *           unique: false,
   *         },
   *       ],
   *     },
   *   ],
   * }
   */
  constructor(options) {
    const { name, stores } = options
    const request = indexedDB.open(name, 1)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      stores.forEach((store) => {
        const { name, keyPath, autoIncrement, indexes = [] } = store
        const objectStore = db.createObjectStore(name, { keyPath, autoIncrement })
        indexes.forEach((index) => {
          const { name, keyPath, unique } = index
          objectStore.createIndex(name, keyPath, { unique })
        })
      })
      db.close()
    }

    this.name = name
  }

  use(storeName) {
    return new InDBStore(storeName, this)
  }

  connect() {
    const name = this.name
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, 1)
      request.onsuccess = (e) => {
        const db = e.target.result
        resolve(db)
      }
      request.onerror = (e) => {
        reject(e)
      }
    })
  }
}

class InDBStore {
  constructor(name, db) {
    this.name = name
    this.db = db
  }

  request(call, mode) {
    return new Promise((resolve, reject) => {
      this.db.connect().then((db) => {
        const tx = db.transaction([this.name], mode)
        const objectStore = tx.objectStore(this.name)
        const request = call(objectStore)
        request.onsuccess = (e) => {
          const { result } = e.target
          resolve(result)
        }
        request.onerror = (e) => {
          reject(e)
        }
      })
    })
  }

  get(key) {
    return this.request(objectStore => objectStore.get(key))
  }

  put(value, key) {
    return this.request(objectStore => objectStore.put(value, key), 'readwrite')
  }

  delete(key) {
    return this.request(objectStore => objectStore.delete(key), 'readwrite')
  }

  count() {
    return this.request(objectStore => objectStore.count())
  }

  each(fn) {
    return new Promise((resolve, reject) => {
      this.db.connect().then((db) => {
        const tx = db.transaction([this.name])
        const objectStore = tx.objectStore(this.name)
        const request = objectStore.openCursor()
        request.onsuccess = (e) => {
          const { result: cursor } = e.target
          if(cursor) {
            const { value } = cursor
            fn(value)
            cursor.continue()
          }
          else {
            resolve()
          }
        }
        request.onerror = (e) => {
          reject(e)
        }
      })
    })
  }

  all() {
    const results = []
    return this.each(value => results.push(value)).then(() => results)
  }
}
