import { concat, flatMap, isArray, isPlainObject, keys, map } from "lodash";

export class ObjectUtil {
  public static getLeaves<T = any>(sourceObject: T, parentKey?: string): string[] {
    let result = [];
    if (isArray(sourceObject)) {
      let idx = 0;
      result = flatMap(sourceObject, (obj) => {
        return ObjectUtil.getLeaves(obj, (parentKey || "") + "[" + idx++ + "]");
      });
    } else if (isPlainObject(sourceObject)) {
      result = flatMap(keys(sourceObject), function (key) {
        return map(ObjectUtil.getLeaves(sourceObject[key], key), function (subkey) {
          return (parentKey ? parentKey + "." : "") + subkey;
        });
      });
    } else {
      result = [];
    }
    return concat(result, parentKey || []);
  }
}