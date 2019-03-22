import { Injectable } from "@angular/core";
import { PropertySearchView } from "../models/propertySearch";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: "root"
})

export class PropertySearchViewService {

    toReturn: PropertySearchView;

    constructor(private http: HttpClient) {}

    public getSearch (params: string, body: any) {
        const _url = `${ environment.server.url }/properties-list?postcode=${ params }&radius=50`;
        console.log(_url);

        return this.http.post(_url, { "filters": body });
    }
}
