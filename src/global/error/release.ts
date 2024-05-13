import { QueryRunner } from "typeorm";

export async function releaseWithError<E extends Error>(runner: QueryRunner, error: E) {
    await runner.release();
    return { success: false, error } as const;
}
