import { Global, Module } from "@nestjs/common";
import { CryptoService } from "@/global/crypto.service";

/**
 * Global module
 */
@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [ CryptoService ],
    exports: [ CryptoService ]
})
export class GlobalModule {}
