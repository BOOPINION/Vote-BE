export class VoteDto {
    id: number;
    title: string;
    author: { id: number, name: string };
    content?: string;
    createdAt: Date;
    lastModifiedAt: Date;
    hashtags: {
        id: number,
        name: string
    }[];
}


export class GetVotesResponseDto {
    votes: VoteDto[];
}
