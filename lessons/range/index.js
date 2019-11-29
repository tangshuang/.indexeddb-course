const request = indexedDB.open('request', 6)
request.onsuccess = function(e) {
  const db = e.target.result
  const tx = db.transaction('store1', 'readwrite')
  const objectStore = tx.objectStore('store1')
  const index = objectStore.index('index1')

  const range = IDBKeyRange.bound('l', 'n')
  // console.log(range.includes('m'))
  const request = index.openCursor(range, 'prev')

  // request.onsuccess = function(e) {
  //   const value = e.target.result
  //   console.log(value)
  // }
  request.onsuccess = function(e) {
    const cursor = e.target.result
    if (cursor) {
      console.log(cursor.value)
      cursor.continue()
    }
  }
  request.onerror = function(e) {
    console.error(e)
  }
}
