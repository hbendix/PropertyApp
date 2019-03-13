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

    constructor (minP: number, maxP: number, minBed: number, maxBed: number, minBath: number,
        maxBath: number, minR: number, maxR: number, tag: Array<string>) {
        this.priceMin = minP;           
        this.priceMax = maxP;     
        this.bedMin = minBed;           
        this.bedMax = maxBed; 
        this.bathMin = minBath;           
        this.bathMax = maxBath;
        this.roomMin = minR;           
        this.roomMax = maxR;
        this.tags = tag;                    
    }
}