export class PropertyView {
    fullAddress: string;
    propertyType: string;
    bedroomNumber: number;
    bathroomNumber: number;
    parkingSpaces: number;
    tags: string[];
    propertyImageUrl: string;
    isForSale: boolean;
    isForRent: boolean;
    price: number;

    propertyName: string;
    _id: string;
    notes: [];

    constructor (fullAddress, 
        propertyType, 
        bedroomNumber, 
        bathroomNumber, 
        parkingSpaces, 
        tags, 
        propertyImageUrl, 
         isForSale, 
        isForRent, 
        price, 
        propertyName,
        notes,
        _id: string) {
            this.fullAddress = fullAddress;             // string
            this.propertyType = propertyType;           // string
            this.bedroomNumber = bedroomNumber;         // number
            this.bathroomNumber = bathroomNumber;       // number
            this.parkingSpaces = parkingSpaces;         // number
            this.tags = tags;                           // string[]
            this.propertyImageUrl = propertyImageUrl;   // string
            this.isForSale = isForSale;                 // boolean
            this.isForRent = isForRent;                 // boolean
            this.price = price;                         // number
            this.propertyName = propertyName; 
            this._id = _id;
            this.notes = notes;
    }
}

export class Property {
    fullAddress: string;
    propertyType: string;
    propertyStats: PropertyStats;
    price: number;
    propertyImageUrl: string;
    constructor(fullAddress, propertyType, propertyStats, price, propertyImageUrl) {
        this.fullAddress = fullAddress;             // string
        this.propertyType = propertyType;           // string
        this.propertyStats = propertyStats;
        this.price = price;
        this.propertyImageUrl = propertyImageUrl;
    }

}

export class PropertyStats {
    bedroomNumber: number;
    bathroomNumber: number;
    parkingSpaces: number;
    tags: string[];
    propertyImageUrl: string;
    isForSale: boolean;
    isForRent: boolean;
    constructor (bedroomNumber, bathroomNumber, parkingSpaces, tags, isForSale, isForRent) {
        this.bedroomNumber = bedroomNumber;         // number
        this.bathroomNumber = bathroomNumber;       // number
        this.parkingSpaces = parkingSpaces;         // number
        this.tags = tags;                           // string[]
        this.isForSale = isForSale;                 // boolean
        this.isForRent = isForRent;                 // boolean
    }
}