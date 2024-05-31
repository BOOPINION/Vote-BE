export class GetValueForUpdateResponseDto {
    id: number;
    title: string;
    content?: string;
    options: { id: number, content: string }[];
    hashtags: { id: number, name: string }[];
}
