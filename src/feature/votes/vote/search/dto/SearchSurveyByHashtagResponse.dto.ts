export class SearchSurveyByHashtagResponseDto {
    hashtagId: number;
    page: number;
    votes: {
        id: number,
        content?: string,
        author: {
            id: number,
            name: string
        },
        hashtags: {
            id: number,
            name: string
        }[]
    }[];
}
