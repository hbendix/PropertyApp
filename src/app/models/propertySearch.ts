export class PropertySearchView {
    postcode: string;
    minPrice: string;
    maxPrice: string;
    houseType: string;
    bedCount: number;

    constructor (postcode: string, min: string, max: string, house: string, bed: number) {
        this.postcode = postcode;       // string
        this.minPrice = min;            // string
        this.maxPrice = max;            // string
        this.houseType = house;         // string
        this.bedCount = bed;            // number
    }
}