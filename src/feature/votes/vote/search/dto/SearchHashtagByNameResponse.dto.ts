export class SearchHashtagByNameResponseDto {
    q: string;
    result: {
        name: string,
        id: number
    }[];
}
