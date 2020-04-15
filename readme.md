# cacheServe

这是一个 node 端的缓存服务客户端，通过 [cacheServe](https://www.npmjs.com/package/cache-serve) 来链接该服务

用来提供一些简单的数据共享服务；内部以对象组成，运行在内存中，保证高速，通过`socket.io`与客户端进行数据通讯；

一旦重启后数据将丢失

例子

```js
const cacheServe = require('cacheServe')
cacheServe.connect('192.168.2.175:3002')
// cacheServe.set({ table: 'cart2', data: { a: { a: 212312 } } }).then(res => {
//   console.log('cart1 处理成功 ：以保存', res)
// })
cacheServe.set({ table: 'cart1', data: { b: 212312 } }).then((res) => {
  console.log('cart1 处理成功 ：以保存', res)
})
cacheServe.get({ table: 'cart1', key: 'a' }).then((res) => {
  console.log('cart1 处理成功 ：以保存 a', res)
})
cacheServe.get({ table: 'cart2', key: 'a' }).then((res) => {
  console.log('cart1 处理成功 ：以保存', res)
})
cacheServe.get({ table: 'cart1', key: 'b' }).then((res) => {
  console.log('cart1 处理成功 ：以保存 a', res)
})
```
