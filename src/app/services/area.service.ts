import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Area } from "../models/area";

@Injectable({
    providedIn: "root"
})

export class AreaService {
    
    area: Area;

    constructor(private http: HttpClient) {}

    public getArea () {
        return this.area;
        // return {
        //     "postcode": "WS15 3BT",
        //     "broadband": {
        //         "super_fast": 0,
        //         "avg_download": "7.7",
        //         "min_download": "3.8",
        //         "max_download": "8.1",
        //         "avg_upload": "0.5",
        //         "min_upload": "0.4",
        //         "max_upload": "0.8"
        //     },
        //     "gas": {
        //         "consumption": "329930.83004",
        //         "meter_count": "17"
        //     },
        //     "electricity": {
        //         "consumption": "49307.9",
        //         "meter_count": "14"
        //     },
        //     "crime": [
        //         {
        //             "type": "anti-social-behaviour",
        //             "location": "On or near Clark's Crescent"
        //         },
        //         {
        //             "type": "other-theft",
        //             "location": "On or near Waters Road"
        //         }
        //     ],
        //     "avgPrice": 362500
        //  }
    }

    public getInternetSpeeds () {
        return {
            "download": 26.36,
            "upload": 11.05
        }
    }

    public pullArea(lat: number, lng: number): any {
        const _url = `${ environment.server.url }/area?lat=${ lat }&long=${ lng }`;

        return this.http.get(_url);
    }

}