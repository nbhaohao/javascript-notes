type typeStringValue =
  | "array"
  | "function"
  | "object"
  | "base"
  | "regExp"
  | "date";
interface CacheItem {
  source: {};
  clone: {};
}
interface UtilCacheProps {
  cache: Array<CacheItem>;
  setCache: (cache: CacheItem) => void;
  getCache: (source: {}) => {};
}

const Util_getType = (source: any): typeStringValue => {
  if (source instanceof Array) {
    return "array";
  }
  if (source instanceof Function) {
    return "function";
  }
  if (source instanceof RegExp) {
    return "regExp";
  }
  if (source instanceof Date) {
    return "date";
  }
  if (source instanceof Object) {
    return "object";
  }
  return "base";
};

const Util_Cache: UtilCacheProps = {
  cache: [],
  setCache(source: any) {
    this.cache.push(source);
  },
  getCache(source: any): any {
    const cacheObj = this.cache.find(cacheItem => cacheItem.source === source);
    if (cacheObj === undefined) {
      return undefined;
    }
    return cacheObj.clone;
  }
};

const cloneArray = (source: any) => {
  const dist = new Array();
  return cloneObjectProps(dist, source);
};

const cloneFunction = (source: any) => {
  const dist = function(this: any) {
    return source.apply(this, arguments);
  };
  return cloneObjectProps(dist, source);
};

const cloneRegExp = (source: any) => {
  const dist = new RegExp(source.source, source.flags);
  return cloneObjectProps(dist, source);
};

const cloneDate = (source: any) => {
  const dist = new Date(source);
  return cloneObjectProps(dist, source);
};

const cloneObject = (source: any) => {
  const dist = new Object();
  return cloneObjectProps(dist, source);
};

const cloneObjectProps = (dist: { [key: string]: any }, source: any) => {
  // 重要！！！先把生成的新对象放到缓存中
  if (Util_getType(dist) !== "base") {
    Util_Cache.setCache({ source: source, clone: dist });
  }
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      dist[key] = deepClone(source[key]);
    }
  }
  return dist;
};

const deepClone = (source: any): any => {
  if (Util_getType(source) !== "base" && Util_Cache.getCache(source)) {
    return Util_Cache.getCache(source);
  }
  switch (Util_getType(source)) {
    case "array":
      return cloneArray(source);
    case "function":
      return cloneFunction(source);
    case "regExp":
      return cloneRegExp(source);
    case "date":
      return cloneDate(source);
    case "object":
      return cloneObject(source);
    case "base":
      return source;
    default:
      return source;
  }
};

export { deepClone };
