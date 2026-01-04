const isPlainObject = (value: any) => {
  return Object.prototype.toString.call(value) === '[object Object]'
}

const mergeTwoObjects = (object1: any, object2: any) => {
  if (object2 == null) {
    return object1;
  }

  if (object1 == null) {
    return object2;
  }

  if (isPlainObject(object1) && isPlainObject(object2)) {
    const result = { ...object1 };

    for (const key in object2) {
      if (Object.prototype.hasOwnProperty.call(object2, key)) {
        const incomingValue = (object2 as any)[key]
        if (incomingValue === undefined) {
          continue
        }

        if (key in result && isPlainObject(result[key]) && isPlainObject(incomingValue)) {
          result[key] = mergeTwoObjects(result[key], incomingValue);
        } else {
          result[key] = incomingValue;
        }
      }
    }

    return result;
  }

  return object1;
}

const mergeObjects = (...objects: any[]) => {
  if (objects == null || objects.length === 0) {
    return undefined;
  }

  return objects.slice(1).reduce((accumulator, current) => {
    return mergeTwoObjects(accumulator, current);
  }, objects[0]);
}

export { mergeObjects }