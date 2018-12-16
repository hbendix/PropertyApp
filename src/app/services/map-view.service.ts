import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: "root"
})

export class MapViewService {

    constructor(private http: HttpClient) {}

    public getMapMarkers(long: Number, lat: Number, radius: Number) {
        const _url = `${environment.server.url}/markers?lat=${lat}&long=${long}&radius=${radius}`;

        return this.http.get(_url);
    }

}
