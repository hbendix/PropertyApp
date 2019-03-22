export class FilterView {
    priceMin: number;
    priceMax: number;
    bedMin: number;
    bedMax: number;
    bathMin: number;
    bathMax: number;
    roomMin: number;
    roomMax: number;
    tags: Array<string>;

    constructor(priceMin: number = null,
        priceMax: number = null,
        bedMin: number = null,
        bedMax: number = null,
        bathMin: number = null,
        bathMax: number = null,
        roomMin: number = null,
        roomMax: number = null,
        tags: Array<string> = []) {
            this.priceMin = priceMin;
            this.priceMax = priceMax;
            this.bedMin = bedMin;
            this.bedMax = bedMax;
            this.bathMin = bathMin;
            this.bathMax = bathMax;
            this.roomMin = roomMin;
            this.roomMax = roomMax;
            this.tags = tags;
        }
}