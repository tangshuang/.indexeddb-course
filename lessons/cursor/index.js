const request = indexedDB.open('request', 6)
request.onsuccess = function(e) {
  const db = e.target.result
  const tx = db.transaction('store1', 'readwrite')
  const objectStore = tx.objectStore('store1')
  // const index = objectStore.index('index1')

  // objectStore.put({
  //   id: 5,
  //   name: 'tom',
  //   age: 12,
  // })

  const request = objectStore.openKeyCursor()
  const results = []

  // let flag = false

  request.onsuccess = function(e) {
    const cursor = e.target.result
    if (cursor) {
      // to jump to target record
      // if (!flag) {
      //   cursor.continuePrimaryKey('lucy', 3)
      //   flag = true
      //   return
      // }

      // // delete
      // if (cursor.key === 'tomy') {
      //   cursor.delete()
      // }

      // if (cursor.key === 'lily') {
      //   cursor.update({
      //     ...cursor.value,
      //     time: new Date(),
      //   })
      // }

      // console.log(cursor.source === objectStore, cursor.direction, cursor.key, cursor.primaryKey, cursor.request === request)
      console.log(cursor.key, cursor.primaryKey)
      const { key } = cursor
      results.push(key)

      cursor.continue()
    }
    else {
      console.log(results)
    }
  }
  request.onerror = function(e) {
    console.error(e)
  }
}
