export class CreateVoteRequestDto {
    title: string;
    authorId: number;
    content: string;
    options: string[];
    hashtags?: string[];
}
