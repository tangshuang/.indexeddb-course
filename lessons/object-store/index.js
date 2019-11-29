const request = indexedDB.open('request', 6)
request.onupgradeneeded = function(e) {
  // console.log('created')
  const db = e.target.result
  db.createObjectStore('outline', {
    autoIncrement: true,
  })
}
request.onsuccess = function(e) {
  const db = e.target.result
  const tx = db.transaction('store1', 'readwrite')
  const objectStore = tx.objectStore('store1')
  const index = objectStore.index('index1')

  // const indexNames = Array.from(objectStore.indexNames)
  // console.log(indexNames, objectStore.keyPath, objectStore.name, objectStore.transaction === tx, objectStore.autoIncrement)

  // const request = objectStore.add({
  //   id: 4,
  //   name: 'lucy',
  //   sex: 'M',
  // })

  const request = index.count('lucy')
  request.onsuccess = function(e) {
    const value = e.target.result
    console.log(value)
  }
  request.onerror = function(e) {
    console.error(e)
  }
}
