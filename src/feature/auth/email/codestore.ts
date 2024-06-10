import { Injectable } from "@nestjs/common";

@Injectable()
export class CodeStore {
    private codes: Map<string, string> = new Map();

    saveCode(email: string, code: string) {
        this.codes.set(email, code);
    }

    getCode(email: string): string | undefined {
        return this.codes.get(email);
    }

    removeCode(email: string) {
        this.codes.delete(email);
    }
}
