import { upgrade, open } from '/database.js'

// const request = indexedDB.open('request') // database request
// console.log(request)

upgrade('request', 3, (db) => {
  const { objectStoreNames } = db
  ;['store1', 'store2', 'store3'].forEach((name) => {
    if (!objectStoreNames.contains(name)) {
      const objectStore = db.createObjectStore(name, { keyPath: 'id' })
      objectStore.createIndex('index1', 'name')
    }
  })
})

open('request', (db) => {
  const tx = db.transaction(['store1', 'store2'], 'readwrite')
  const objectStore = tx.objectStore('store1')

  const request = objectStore.put({ id: 2, name: 'test2' }) // objectStore request
  request.onsuccess = (e) => {
    const tx1 = e.target.transaction
    console.log(e.target)

    const index = objectStore.index('index1')
    const request = index.get('test2') // index request
    request.onsuccess = e => {
      const tx2 = e.target.transaction
      console.log(tx1 === tx2)
    }

    const request2 = objectStore.openCursor()
    request2.onsuccess = e => {
      const cursor = e.target.result
      console.log(cursor)
    }
  }
})
