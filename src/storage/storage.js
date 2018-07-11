import * as Storages from './extend'
import Base from './libs/base'

/**
 * 实例缓存
 * @type {{}}
 */
const CACHE_ENGINES = {}

/**
 * 数据存储
 * @param {...string} ens - 数据存储的引擎类型，如果有多个类型系统会从左往右依次检查直到检查到可用的引擎
 * @return {Base}
 */
export default function storage (...ens) {
  let type = 'Normal'
  if (ens && ens.length) {
    type = ens.shift()
  }
  let inst = CACHE_ENGINES[type]
  if (inst) {
    return inst
  }
  inst = Storages[type] ? new Storages[type]() : new Storages.Normal()
  CACHE_ENGINES[type] = inst.check() ? inst : storage.apply(this, ens)
  return CACHE_ENGINES[type]
}