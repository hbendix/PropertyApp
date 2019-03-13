export class PropertySearchView {
    postcode: string;
    minPrice: number;
    maxPrice: number;
    houseType: string;
    bedCount: number;

    constructor (postcode: string, min: number, max: number, house: string, bed: number) {
        this.postcode = postcode;       // string
        this.minPrice = min;            // string
        this.maxPrice = max;            // string
        this.houseType = house;         // string
        this.bedCount = bed;            // number
    }
}