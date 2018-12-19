export class Area {
    areaID: string;
    areaName: string;
    avgHouseType: string;
    postcode: string;
    avgPrice: number;
    avgBedCount: number;

    constructor(id : string, name : string, hType : string, code: string, cost : number, bed : number) {
        this.areaID = id;
        this.areaName = name;
        this.avgHouseType = hType;
        this.postcode = code;
        this.avgPrice = cost;
        this.avgBedCount = bed;
    }
}