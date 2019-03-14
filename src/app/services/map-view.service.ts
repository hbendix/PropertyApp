import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { filter } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})

export class MapViewService {

    mapMarkers = [];
    isBeingFiltered = false;
    filterBody: any;

    constructor(private http: HttpClient) {}

    public saveMapMarkers (mapMarkers: any) {
        this.mapMarkers.push(mapMarkers);
    }

    public setFilterBody (body) {
        this.isBeingFiltered = true;
        this.filterBody = body;
    }

    public pullMapMarkers(long: Number, lat: Number, radius: Number) {       
        const _url = `${environment.server.url}/markers?lat=${lat}&long=${long}&radius=${radius}`;

        if (this.isBeingFiltered) {
            console.log("Attempting to filter... ");
            console.log({"filters":this.filterBody});
            return this.http.post(_url, {"filters":this.filterBody});
        } else {
            console.log("No Filter Attempt");
            return this.http.post(_url, {});        
        }

    }

    public getMapMarkers () {
        return this.mapMarkers;
    }

}
