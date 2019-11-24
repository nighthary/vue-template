
let storage = window.localStorage
export default {
  get(key) {
    try {
      return JSON.parse(storage.getItem(key))
    } catch (e) {
      return storage.getItem(key)
    }
  },
  set(key, o) {
    if (typeof o === 'object') {
      storage.setItem(key, JSON.stringify(o))
    } else {
      storage.setItem(key, o)
    }
  },
  remove(key) {
    storage.removeItem(key)
  }
}
