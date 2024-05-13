export type Result<T, E = Error> = { success: true, value: T } | { success: false, error: E };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[])=> any;

export function doFp<Func extends AnyFunction, Err = Error>(
    func: Func, ...args: Parameters<Func>
): Result<ReturnType<Func>, Err> {
    try {
        const result = func(...args);
        return { success: true, value: result };
    } catch (e) {
        return { success: false, error: e as Err };
    }
}

export async function doAsyncFp<Func extends AnyFunction, Err = Error>(
    func: Func, ...args: Parameters<Func>
): Promise<Result<ReturnType<Func> extends Promise<infer T> ? T : never, Err>> {
    try {
        const result = await func(...args);
        return { success: true, value: result };
    } catch (e) {
        return { success: false, error: e as Err };
    }
}
