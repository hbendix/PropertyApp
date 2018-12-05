import { Injectable } from "@angular/core";
import { PropertyView, SaleHistoryObject } from "../models/property";

@Injectable({
    providedIn: "root"
})

export class PropertyViewService {

    toReturn: PropertyView;

    constructor() {}

    getPropertyModel() {
        this.toReturn.fullAddress = "fullAddress";             // string
        this.toReturn.propertyType = "propertyType";           // string
        this.toReturn.bedroomNumber = 1;         // number
        this.toReturn.bathroomNumber = 1;       // number
        this.toReturn.parkingSpaces = 2;         // number
        this.toReturn.tags = ["tags"];                           // string[]
        this.toReturn.propertyImageUrl = "propertyImageUrl";   // string
        this.toReturn.streetviewLink = "streetviewLink";       // string
        this.toReturn.isForSale = true;                 // boolean
        this.toReturn.isForRent = false;                 // boolean
        this.toReturn.price = 200000;                         // number
        this.toReturn.saleHistory = [new SaleHistoryObject()];             // {date, price}[]

        return this.toReturn;
    }

}
