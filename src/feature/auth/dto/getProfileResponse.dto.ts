export class GetProfileResponseDto {
    id: number;
    email: string;
    username: string;
    personalInfo: {
        gender: string | null,
        age: number | null
    } | null;
}
