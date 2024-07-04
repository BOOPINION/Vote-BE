export function omit<T extends object, K extends Array<keyof T>>(obj: T, keys: K) {
    const allKeys = Object.keys(obj) as K;
    const filteredKeys = allKeys.filter((k) => !keys.includes(k));

    const omittedObj: Partial<T> = {};
    filteredKeys.map((k) => omittedObj[k] = obj[k]);

    return omittedObj as Omit<T, keyof T>;
}
