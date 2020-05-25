export interface Range {
    begin: number;
    end: number;
    limit: {
        take: number;
        skip: number;
    };
}
