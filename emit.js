/*
 * @Author: zhengguozhi
 * @Date: 2018-12-12 12:06:21
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-04-15 12:02:37
 */
// 观察者-订阅-发布
/**
 * myEmit.$on('myevent',(d)=>{},1)   添加监听事件  一次
 * myEmit.$emit('myevent',data,still)   执行事件 并传data  一次 still 为true 时 可以在 先触发事件 再 订阅事件时 出发事件
 *
*/

//
let runcache = {}
let runcacheFnIndex = {}
let cacheFn = {}
const emit = {
  $onSigle: function (type, fn) {
    if (this._checkFn(fn)) {
      runcache[type] = [fn]
      runcacheFnIndex[type] = [true]
      this._runCacheFn(type, fn)
    }
  },
  $on: function (type, fn, onece) {
    if (this._checkFn(fn)) {
      this.$rm(type, fn)
      this.$bind(type, fn, onece)
      this._runCacheFn(type, fn)
    }
  },
  $bind (type, fn, onece) {
    if (typeof runcache[type] === 'undefined') {
      runcache[type] = [fn]
      runcacheFnIndex[type] = typeof onece === 'number' ? [onece] : [!!onece]
    } else {
      runcache[type].unshift(fn)
      runcacheFnIndex[type].unshift(typeof onece === 'number' ? onece : !!onece)
    }
  },
  _checkFn (fn) {
    if (typeof fn !== 'function') {
      console.warn('第二个参数必须是一个函数')
      return false
    }
    return true
  },
  _cacheFn: function (type, args) {
    cacheFn[type] = args
  },
  _runCacheFn: function (type, fn) {
    if (cacheFn[type]) {
      fn.call(this, cacheFn[type])
      delete (cacheFn[type])
    }
  },
  $emit: function (type, args, still) {
    // console.log('$emit', type, args)
    args = args || {}
    // console.log('runcache', runcache, type)
    if (!runcache[type]) {
      if (still) {
        this._cacheFn(type, args)
      }
      return
    }
    let i = 0
    let leng = runcache[type].length - 1
    for (; i <= leng; i++) {
      runcache[type][i].call(this, args)
      // 2018-9-5 xuxueliang fix
      // runcacheFnIndex[type][i] ||
      if (runcacheFnIndex[type] && typeof runcacheFnIndex[type][i] === 'number') {
        // typeof runcacheFnIndex[type][i] !== 'number' ||
        if (runcacheFnIndex[type][i] === 1 || runcacheFnIndex[type][i] < 2) {
          runcache[type].splice(i, 1)
          runcacheFnIndex[type].splice(i, 1)
          --i
          --leng
        } else {
          runcacheFnIndex[type][i]--
        }
      }
    }
  },
  $rm: function (type, fn, all = false) {
    if (runcache[type] instanceof Array) {
      if (all) {
        delete runcache[type]
        delete runcacheFnIndex[type]
      } else {
        let i = runcache[type].length - 1
        let j = []
        for (; i >= 0; i--) {
          try {
            ((runcache[type][i] === fn) || runcache[type][i].toString() === fn.toString()) && j.push(i) && runcache[type].splice(i, 1) && runcacheFnIndex[type].splice(i, 1)
          } catch (e) {
            console.error(e)
          }
        }
      }
    }
  }
}

const $on = (...a) => {
  emit.$on(...a)
}
const $emit = (...a) => {
  emit.$emit(...a)
}
const $rm = (...a) => {
  emit.$rm(...a)
}
const $onSigle = (...a) => {
  emit.$onSigle(...a)
}

module.exports = { $on, $emit, $rm }