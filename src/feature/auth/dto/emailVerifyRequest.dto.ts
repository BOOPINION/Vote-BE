export class EmailVerifyRequestDto {
    email: string;
    state: {
        code: string,
        verified: boolean
    };
    verifyCode: string;
}
