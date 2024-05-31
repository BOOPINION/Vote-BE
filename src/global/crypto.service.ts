import { Injectable } from "@nestjs/common";
import { pbkdf2, randomBytes } from "crypto";
import { CryptoConfig } from "@/global/config/crypto";
import { User } from "./model/db/user";

/**
 * Crypto service
 */
@Injectable()
export class CryptoService {
    /**
   * Encrypt plain text with salt by SHA-512.
   * @param plain plain text that will be encrypted
   * @param salt salt that will be used to encrypt the plain text
   * @param length length of text. default is `CryptoConfig.HASHED_PASSWORD_LENGTH`.
   * Be careful this not means output length.
   * @returns encrypted text in base64 format with 512 byte length.
   */
    public async encrypt(
        plain: string,
        salt: string,
        length: number = CryptoConfig.HASHED_PASSWORD_LENGTH
    ) {
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
    public async generateSalt(
        length: number = CryptoConfig.SALT_LENGTH
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            randomBytes(length, (err, buffer) => {
                if (err) reject(err);
                else resolve(buffer.toString("base64"));
            });
        });
    }

    public async decipher(
        encrypted: string,
        user: User
    ) {
        return new Promise<string>((resolve, reject) => {
            const salt = user.passwordSalt;
            const length = CryptoConfig.HASHED_PASSWORD_LENGTH;
            pbkdf2(encrypted, salt, 1024, length, "sha512", (err, derivedKey) => {
                if (err) reject(err);
                else resolve(derivedKey.toString("base64"));
            });
        });
    }
}
