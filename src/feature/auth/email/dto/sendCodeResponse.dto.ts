export class SendCodeResponseDto {
    email: string;
    state: {
        code: string,
        verified: boolean
    };
}
