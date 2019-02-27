export class ShortListItem {
    id: string;
    fullAddress: string;
    price: number;
    imageSrc?: string;

    constructor(id: string,
        fullAddress: string,
        price: number,
        imageSrc?: string) {
        this.id = id;
        this.fullAddress = fullAddress;
        this.price = price;
        this.imageSrc = imageSrc;
    }
}