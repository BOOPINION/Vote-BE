import { Injectable } from "@nestjs/common";
import { randomBytes, pbkdf2 } from "crypto";
import { CryptoConfig } from "@/global/config/crypto";

/**
 * Crypto service
 */
@Injectable()
export class CryptoService {
    /**
     * Encrypt plain text with salt
     * @param plain plain text that will be encrypted
     * @param salt salt that will be used to encrypt the plain text
     * @param length length of the hashed password. default is `CryptoConfig.HASHED_PASSWORD_LENGTH`
     */
    public async encrypt(plain: string, salt: string, length: number = CryptoConfig.HASHED_PASSWORD_LENGTH) {
        return new Promise<string>((resolve, reject) => {
            pbkdf2(plain, salt, 1024, length, "sha512", (err, derivedKey) => {
                if (err) reject(err);
                else resolve(derivedKey.toString("base64"));
            });
        });
    }

    /*
    *  Generate random salt
    */
    public async generateSalt(length: number = CryptoConfig.SALT_LENGTH): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            randomBytes(length, (err, buffer) => {
                if (err) reject(err);
                else resolve(buffer.toString("base64"));
            });
        });
    }
}
