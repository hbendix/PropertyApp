import { Injectable } from "@angular/core";
import { FilterView } from "../models/filter";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: "root"
})

export class FilterViewService {

    toReturn: FilterView;

    constructor(private http: HttpClient) {}

    public getPropertyModel(long: Number, lat: Number) {
        const _url = `${environment.server.url}/properties?lat=${lat}&long=${long}`;

        console.log(_url);

        return this.http.get(_url);        
    }

}