export class GetVoteResponseDto {
    id: number;
    title: string;
    content?: string;
    createdAt: Date;
    lastModifiedAt: Date;
    author: {
        id: number,
        name: string
    };
    options: {
        id: number,
        content: string
    }[];
    hashtags: { id: number, name: string }[];
    likes: number;
    comments: number;
}
