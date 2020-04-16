/*
 * @Author: xuxueliang
 * @Date: 2020-04-15 11:45:28
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-04-15 12:05:17
 */
const myEmit = require('./emit')
function UUID (str) {
  return (str || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
module.exports.asyncEmit = function asyncEmit (socket) {
  socket.on('message from serve', (data) => {
    myEmit.$emit(data.mid, data)
  })
  // socket._emit = socket.emit
  socket.asyncEmit = function (eventName, data = {}) {
    return new Promise((resolve, reject) => {
      if (typeof data != 'object') {
        console.log('socket.emit 需要传递对象而不是字符串')
        reject(null)
        return null
      }
      let timeoutId = setTimeout(() => {
        reject('超时')
      }, 10000)
      data.mid = UUID('xxxxx-xxyx-xxyx-xxxxx')
      myEmit.$on(data.mid, (data) => {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        resolve(data)
      }, 1)
      socket.emit(eventName, data)
    })
  }
}
module.exports.getResult = function (code = 200, userMsg = '', ...data) {
  if (typeof code !== 'number') {
    data.unshift(code)
    code = 200
  }
  if (typeof userMsg !== 'string') {
    data.unshift(userMsg)
    userMsg = 200
  }
  data.unshift({})
  return {
    error: { errno: code, usermsg: userMsg },
    ...Object.assign.apply(null, data.map(v => {
      if (typeof v === 'object') {
        return v
      }
      return { [v]: v }
    }))
  }
}