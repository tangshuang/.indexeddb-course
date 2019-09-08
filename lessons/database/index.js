let version = localStorage.getItem('indexeddb_database_version') || 1

function open(name, callback) {
  const request = indexedDB.open(name)
  request.onsuccess = function(e) {
    const db = e.target.result
    callback(db)
  }
}

function upgrade(name, callback) {
  version ++
  localStorage.setItem('indexeddb_database_version', version)

  const request = indexedDB.open(name, version)
  request.onupgradeneeded = (e) => {
    const db = e.target.result
    callback(db)
    db.close()
  }
}

// ---------------------------------------------

function getDatabaseProperties() {
  open('database', (db) => {
    console.log(`
      name: ${db.name}
      version: ${db.version}
      objectStoreNames: ${Array.from(db.objectStoreNames).join(',')}
    `)
  })
}

function createObjectStore(objectStoreName) {
  upgrade('database', (db) => {
    const { objectStoreNames } = db
    if (!objectStoreNames.contains(objectStoreName)) {
      const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id' })
      console.log(objectStore)
    }
  })
}

function deleteObjectStore(objectStoreName) {
  upgrade('database', (db) => {
    const { objectStoreNames } = db
    console.log(db.objectStoreNames)
    if (objectStoreNames.contains(objectStoreName)) {
      console.log(db.objectStoreNames)
      db.deleteObjectStore(objectStoreName)
      console.log(db.objectStoreNames)
    }
  })
}
