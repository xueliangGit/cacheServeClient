/*
 * @Author: xuxueliang
 * @Date: 2020-04-15 12:22:05
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-04-15 17:35:36
 */
const cacheServe = require('./index')
cacheServe.connect('192.168.2.175:3002')
// cacheServe.set({ table: 'cart2', data: { a: { a: 212312 } } }).then(res => {
//   console.log('cart1 处理成功 ：以保存', res)
// })
cacheServe.set({ table: 'cart1', data: { b: 212312 } }).then(res => {
  console.log('cart1 处理成功 ：以保存', res)
})
cacheServe.get({ table: 'cart1', key: 'a' }).then(res => {
  console.log('cart1 处理成功 ：以保存 a', res)
})
cacheServe.get({ table: 'cart2', key: 'a' }).then(res => {
  console.log('cart1 处理成功 ：以保存', res)
})
cacheServe.get({ table: 'cart1', key: 'b', params: { lifetime: 3000 } }).then(res => {
  console.log('cart1 处理成功 ：以保存 a', res)
})
let times = {}
module.exports.setData = function (isGet) {
  console.log(isGet)
  if (isGet) {
    times.setB = Date.now()
  } else {
    times.getB = Date.now()
  }
  for (var i = 100; i >= 0; i--) {
    setData(i)
  }
  setTimeout(() => {
    for (var i = 100; i >= 0; i--) {
      getData(i)
    }
    setTimeout(() => {
      for (var i = 100; i >= 0; i--) {
        getData(i)
      }
    }, 2000)
  }, 2000)
}

function getData (i) {
  cacheServe.get({ table: 'cart1', key: 'a' + i }).then(res => {
    if (i <= 1) {
      times.getE = Date.now() - times.getB
      console.log('数据执行完毕,耗时：', times.getE, 'ms')
    } else {
      console.log(res, i, 'get')
      // getData(--i)
    }
  })
}
function setData (i) {
  let data = {}
  data['a' + i] = i
  cacheServe.set({ table: 'cart1', data, params: { lifetime: 3000 } }).then(res => {
    if (i <= 1) {
      times.setE = Date.now() - times.setB
      console.log('数据执行完毕,耗时：', times.setE, 'ms')
    } else {
      console.log(data, i, 'set')
      // setData(--i)
    }
  })
}