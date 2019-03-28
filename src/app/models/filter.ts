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

export class DropDownData {
    static getPriceRange () {
        return [
            "£100,000",
            "£200,000",
            "£300,000",
            "£400,000",
            "£500,000",
            "£600,000",
            "£700,000",
            "£800,000",
            "£900,000",
            "£1,000,000",
            "£2,000,000",
            "£3,000,000",
            "£4,000,000",
            "£5,000,000",
            "£6,000,000",
            "£7,000,000",
            "£8,000,000",
            "£9,000,000",
        ]
    }

    static getCounts () {
        return [ "1", "2", "3", "4", "5", "6" ]
    } 

    static getRadius () {
        return [
            "5 KM",
            "10 KM",
            "15 KM",
            "20 KM",
            "25 KM",
            "30 KM",
            "35 KM",
            "40 KM",
            "45 KM",
            "45 KM",
            "55 KM",
            "60 KM",
            "65 KM",
            "70 KM",
            "75 KM",
            "80 KM",
            "85 KM",
            "90 KM",
            "95 KM",
            "99 KM",
        ]
    }
}