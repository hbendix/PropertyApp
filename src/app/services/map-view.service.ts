import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: "root"
})

export class MapViewService {

    mapMarkers = [];

    constructor(private http: HttpClient) {}

    public saveMapMarkers (mapMarkers: any) {
        this.mapMarkers.push(mapMarkers);
    }

    public pullMapMarkers(long: Number, lat: Number, radius: Number) {       
        const _url = `${environment.server.url}/markers?lat=${lat}&long=${long}&radius=${radius}`;

        return this.http.post(_url, {});        
    }

    public getMapMarkers () {
        return this.mapMarkers;
    }

}
