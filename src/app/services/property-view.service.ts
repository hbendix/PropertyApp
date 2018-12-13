import { Injectable } from "@angular/core";
import { PropertyView } from "../models/property";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: "root"
})

export class PropertyViewService {

    toReturn: PropertyView;

    constructor(private http: HttpClient) {}

    public getPropertyModel(long: Number, lat: Number) {
        const _url = `${environment.server.url}/property?lat=${lat}?long=${long}`;

        return this.http.get(_url);        
    }

}
