export class UpdateVoteRequestDto {
    title: string;
    content: string;
    options: {
        id?: number,
        content: string
    }[];
    hashtags: string[];
}
