
function open(callback) {
  const request = indexedDB.open('factory')
  request.onsuccess = function(e) {
    const db = e.target.result
    callback(db)
  }
}

async function del() {
  open(async (db) => {
    const dbs = await indexedDB.databases()
    console.log(dbs)
    db.close() // 删除数据库之前必须要把这个数据库关闭
    const request = indexedDB.deleteDatabase('factory')
    request.onerror = e => console.log(e)
    request.onsuccess = async function(e) {
      console.log('hint')
      const dbs = await indexedDB.databases()
      console.log(dbs)
    }
  })
}
