import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { filter } from "rxjs/operators";
import { FilterView } from "../models/filter";

@Injectable({
    providedIn: "root"
})

export class MapViewService {

    public mapMarkers: any[] = [];

    public isBeingFiltered = false;
    public filterBody: FilterView;

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
            return this.http.post(_url, { "filters": this.filterBody });
        } else {
            return this.http.post(_url, {});        
        }

    }

    public getMapMarkers () {
        return this.mapMarkers;
    }

}
