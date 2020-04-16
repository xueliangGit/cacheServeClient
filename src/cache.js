/*
 * @Author: xuxueliang
 * @Date: 2020-04-14 20:07:43
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-04-16 11:58:37
 */
const { getResult } = require('./utils')
class Table {
  constructor(name) {
    this.name = name
    this.cache = {}
  }
  set (data = {}, { lifetime = 60 * 1000 * 60 }) {
    try {
      Object.assign(this.cache, data)
      setTimeout(() => {
        this.del(data)
      }, lifetime)
      return getResult(200)
    } catch (e) {
      return getResult(201, e)
    }
  }
  get (key) {
    return this.cache[key] ? getResult(200, '', { data: this.cache[key] }) : getResult(204, 'none')
  }
  del (key) {
    if (typeof key === 'object') {
      Object.keys(key).forEach(v => this.del(v))
    } else if (key) {
      delete this.cache[key]
    }
  }
}
var tablesData = {}
function getTable () {
  return getResult(200, '', { data: Object.keys(tablesData) })
}
function setData ({ table, data, params = {} }) {
  if (!tablesData[table]) {
    tablesData[table] = new Table(table)
  }
  return tablesData[table].set(data, { lifetime: params.lifetime })
}
function delData ({ table, key }) {
  if (!tablesData[table]) {
    return
  }
  tablesData[table].del(key)
}
function getData ({ table, key }) {
  if (!tablesData[table]) {
    return getResult(204, 'none')
  }
  return tablesData[table].get(key)
}
module.exports = {
  getTable, setData, getData, delData
}