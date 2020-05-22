export interface Options {
    begin: number;
    end: number;
    limit: {
        take: number;
        skip: number;
    };
}
