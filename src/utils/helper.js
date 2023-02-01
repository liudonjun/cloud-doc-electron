/**
 * array to map
 * @param {*} arr 
 * @returns 
 */
export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});
};

/**
 * object to array
 * @param {*} obj 
 * @returns 
 */
export const objToArr = (obj) => Object.keys(obj).map((key) => obj[key]);
