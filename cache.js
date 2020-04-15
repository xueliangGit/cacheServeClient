/*
 * @Author: xuxueliang
 * @Date: 2020-04-14 20:07:43
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-04-15 12:39:21
 */
const { getResult } = require('./utils')
class Table {
  constructor(name) {
    this.name = name
    this.cache = {}
  }
  set (data = {}) {
    try {
      Object.assign(this.cache, data)
      return getResult(200)
    } catch (e) {
      return getResult(201, e)
    }
  }
  get (key) {
    return this.cache[key] ? getResult(200, '', { data: this.cache[key] }) : getResult(204, 'none')
  }
}
var tablesData = {}
function getTable () {
  return getResult(200, '', { data: Object.keys(tablesData) })
}
function setData ({ table, data }) {
  if (!tablesData[table]) {
    tablesData[table] = new Table(table)
  }
  return tablesData[table].set(data)
}

function getData ({ table, key }) {
  if (!tablesData[table]) {
    return getResult(204, 'none')
  }
  return tablesData[table].get(key)
}
module.exports = {
  getTable, setData, getData
}