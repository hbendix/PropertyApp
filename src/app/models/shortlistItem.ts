export class ShortListItem {
    _id: string;
    fullAddress: string;
    propertyName: string;
    imageSrc: string;

    constructor(_id: string,
        fullAddress: string,
        propertyName: string,
        imageSrc: string) {
        this._id = _id;
        this.fullAddress = fullAddress;
        this.propertyName = propertyName;
        this.imageSrc = imageSrc;
    }
}

export class AreaShortListItem {
    _id: string;
    postcode: string;
    avgPrice: number;
    long: number;
    lat: number;
}