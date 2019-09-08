upgrade('transaction', (db) => {
  const { objectStoreNames } = db
  ;['store1', 'store2', 'store3'].forEach((name) => {
    if (!objectStoreNames.contains(name)) {
      db.createObjectStore(name, { keyPath: 'id' })
    }
  })
})

open('transaction', (db) => {
  const tx = db.transaction(['store1', 'store2'], 'readwrite')
  const tx2 = db.transaction(['store1', 'store3'], 'readwrite')

  console.log(tx.objectStoreNames)
  const objectStore = tx.objectStore('store1')
  const objectStore2 = tx2.objectStore('store1')
  console.log(objectStore === objectStore2)

  const request = objectStore.put({ id: 2, value: 'test2' })
  tx.addEventListener('abort', (e) => console.log(e))
  tx.abort()

  db.close()
})
