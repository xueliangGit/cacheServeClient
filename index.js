/*
 * @Author: xuxueliang
 * @Date: 2020-04-14 19:16:29
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-04-15 16:33:39
 */
/**socket.io在服务器端创建客户端*/
const { asyncEmit } = require('./utils')
const myEmit = require('./emit')
var io = require('socket.io-client');
const cache = require('./cache')
let catchData = []
let getDateQsueue = []
let socket = null
let config = {
  connectNum: 0,
  isConnect: false,
  isConnecting: false,
  url: null
}
/**
 * @description: 链接服务器
 * @param url
 * @return: 
 */
function connect (url) {
  if (url.indexOf('http') < 0) {
    url = 'http://' + url
  }
  config.url = url
  config.isConnecting = true
  socket = io.connect(url);//{reconnect: true}断开再重连，不建议使用，自行控制 
  asyncEmit(socket)
  // 当关闭连接后触发 disconnect 事件
  socket.on('connect', function (socket) {//绑定连接上服务器之后触发的数据
    console.log('连上了服务器!');
    config.connectNum++
    config.isConnect = true
    config.isConnecting = false
    checkGetCacheData()
    checkHasCacheData()
    myEmit.$emit('isConnected')
  });
  socket.on('disconnect', function () {
    console.log('断开一个连接。');
    config.isConnect = false
    config.isConnecting = false
  });

}
/**
 * @description: 同步本地的缓存到服务器
 * @return: 
 */
function checkHasCacheData () {
  if (catchData.length) {
    socket.asyncEmit('set', catchData.pop()).then(res => {
      if (!catchData.length) {
        console.log('数据已同步')
      }
    })
    checkHasCacheData()
  }
}
/**
 * @description: 从服务器获取新的数据
 * @return: 
 */
function checkGetCacheData () {
  if (getDateQsueue.length) {
    getDateQsueue.pop()()
    checkGetCacheData()
  }
}
/**
 * @description: 重连服务器
 * @param {} 
 * @return: 
 */
function reConnect () {
  config.url && !config.isConnecting && connect(config.url)
  console.log(config.connectNum > 0 ? '链接已掉线' : '链接未初始化', '，数据将存在本地；接下来将尝试重连并同步数据', config.url)
}
/**
 * @description: 获取数据
 * @param table 数据分类名
 * @param key 数据键值
 * @return: {} 数据
 */
function get ({ table, key }) {
  return new Promise((resolve, reject) => {
    if (config.isConnect) {
      socket.asyncEmit('get', { table, key }).then(res => {
        resolve(res)
      })
    } else {
      let da = cache.getData({ table, key })
      if (da.error.errno === 200) {
        resolve(da)
      } else {
        getDateQsueue.push(() => {
          get({ table, key }).then(resolve)
        })
      }
      reConnect()
    }
  })
}
/**
 * @description: 设置数据
 * @param table 分类名
 * @param data 数据 是个 object
 * @return: 
 */
function set ({ table, data }) {
  return new Promise((resolve, reject) => {
    if (config.isConnect) {
      socket.asyncEmit('set', { table, data }).then(res => {
        resolve(res)
      })
    } else {
      catchData.push({ table, data })
      resolve(cache.setData({ table, data }))
      reConnect()
    }
  })
}
module.exports = {
  connect, get, set
}