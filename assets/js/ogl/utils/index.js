// SEE: https://github.com/vuejs/vue/issues/9259
export function makeReactive (obj) {
    // eslint-disable-next-line no-proto
    const proto = obj.__proto__
  
    Object.defineProperty(obj, '__proto__', {
      get () { return proto },
      // eslint-disable-next-line no-proto
      set (newValue) { proto.__proto__ = newValue }
    })
  }