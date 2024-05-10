export function pick<T extends object, K extends Array<keyof T>>(obj: T, keys: K) {
    const allKeys = Object.keys(obj) as K;
    const filteredKeys = allKeys.filter((k) => keys.includes(k));

    const pickedObj: Partial<T> = {};
    filteredKeys.map((k) => pickedObj[k] = obj[k]);

    return pickedObj as Pick<T, keyof T>;
}
