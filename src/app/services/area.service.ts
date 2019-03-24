import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Area } from "../models/area";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root"
})

export class AreaService {
    
    area: Area;

    constructor(private http: HttpClient,
        private auth: AuthService) {}

    public getArea () {
        return this.area;
    }

    public setArea (area) {
        this.area = area;
    }

    public getInternetSpeeds () {
        return {
            "download": 26.36,
            "upload": 11.05
        }
    }

    public viewArea (areaId) {
        const _url = `${environment.server.url}/shortlist/area/get?username=${ this.auth.getLoggedInUser() }&areaid=${ areaId }`;

        return this.http.get(_url);
    }

    public pullArea(lat: number, lng: number): any {
        const _url = `${ environment.server.url }/area?lat=${ lat }&long=${ lng }`;

        return this.http.get(_url);
    }

}