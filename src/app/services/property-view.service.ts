import { Injectable } from "@angular/core";
import { PropertyView, Property } from "../models/property";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root"
})

export class PropertyViewService {
    
    public isViewingShortList = false;
    public toView: PropertyView;
    
    constructor(private http: HttpClient,
        private auth: AuthService) {}
    
    public getPropertyModel(long: Number, lat: Number) {
        const _url = `${environment.server.url}/properties?lat=${lat}&long=${long}`;

        return this.http.post(_url, {});                
    }
    
    public viewProperty(propertyId: string) {
        this.isViewingShortList = true;
        const _url = `${environment.server.url}/shortlist/property?username=${ this.auth.getLoggedInUser() }&propertyid=${ propertyId }`;
        console.log(_url);
        return this.http.get(_url);
    }

    public getShortListProperty () {
        return this.toView;
    }
}
