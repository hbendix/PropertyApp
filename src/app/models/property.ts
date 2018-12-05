export class PropertyView {
    fullAddress: string;
    propertyType: string;
    bedroomNumber: number;
    bathroomNumber: number;
    parkingSpaces: number;
    tags: string[];
    propertyImageUrl: string;
    streetviewLink: string;
    isForSale: boolean;
    isForRent: boolean;
    price: number;
    saleHistory: SaleHistoryObject[];

    constructor (fullAddress, propertyType, bedroomNumber, bathroomNumber, parkingSpaces, tags, propertyImageUrl, streetviewLink, isForSale, isForRent, price, saleHistory) {
            this.fullAddress = fullAddress;             // string
            this.propertyType = propertyType;           // string
            this.bedroomNumber = bedroomNumber;         // number
            this.bathroomNumber = bathroomNumber;       // number
            this.parkingSpaces = parkingSpaces;         // number
            this.tags = tags;                           // string[]
            this.propertyImageUrl = propertyImageUrl;   // string
            this.streetviewLink = streetviewLink;       // string
            this.isForSale = isForSale;                 // boolean
            this.isForRent = isForRent;                 // boolean
            this.price = price;                         // number
            this.saleHistory = saleHistory;             // {date, price}[]
    }
}

export class SaleHistoryObject {
    date: Date;
    price: number;
}