export class CommentsDto {
    username: string;
    contents: string;
    createdAt: Date;
}

export class GetCommentsResponseDto {
    comments: CommentsDto[];
}
