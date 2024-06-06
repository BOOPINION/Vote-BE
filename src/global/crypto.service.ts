import { Injectable } from "@nestjs/common";
import { pbkdf2, randomBytes } from "crypto";
import { CryptoConfig } from "@/global/config/crypto";
import { User } from './model/db/user';

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

    public generateRandomPassword(length: number = 12): string {
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|]}[{";
        let password = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return password;
    }
}
