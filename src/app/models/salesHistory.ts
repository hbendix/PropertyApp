export interface SalesHistory { 
    fullAddress: string;
    propertyType: string;
    saleHistory: SaleHistory[];
}

export interface SaleHistory {
    data: Date;
    price: number;
}