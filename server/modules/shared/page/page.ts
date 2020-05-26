export class Page<T> {
    begin: number;
    end: number;
    items: T[];

    getHeader(): string {
        return this.begin + "-" + this.end + "/" + this.items.length;
    }
}
