import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: "root"
})

export class MapViewService {

    mapMarkers = [];
    isBeingFilered = false;
    filterBody: any;

    constructor(private http: HttpClient) {}

    public saveMapMarkers (mapMarkers: any) {
        this.mapMarkers.push(mapMarkers);
    }

    public setFilterBody (body) {
        this.isBeingFilered = true;
        this.filterBody = body;
    }

    public pullMapMarkers(long: Number, lat: Number, radius: Number) {       
        const _url = `${environment.server.url}/markers?lat=${lat}&long=${long}&radius=${radius}`;

        if (this.isBeingFilered) {
            return this.http.post(_url, this.filterBody);
        } else {
            return this.http.post(_url, {});        
        }

    }

    public getMapMarkers () {
        return this.mapMarkers;
    }

}
