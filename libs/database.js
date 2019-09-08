export function open(name, callback) {
  const request = indexedDB.open(name)
  request.onsuccess = function(e) {
    const db = e.target.result
    callback(db)
  }
}

export function upgrade(name, version, callback) {
  const request = indexedDB.open(name, version)
  request.onupgradeneeded = (e) => {
    const db = e.target.result
    callback(db)
    db.close()
  }
}
