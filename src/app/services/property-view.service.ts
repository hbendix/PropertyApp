import { Injectable } from "@angular/core";
import { PropertyView, Property } from "../models/property";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from "./auth.service";
import { MapViewService } from "./map-view.service";
import { SalesHistory } from "../models/salesHistory";

@Injectable({
    providedIn: "root"
})

export class PropertyViewService { 
    
    public isViewingShortList = false;
    public toView: PropertyView;
    saleHistory: SalesHistory[];
    
    constructor(private http: HttpClient,
        private auth: AuthService,
        private mapViewService: MapViewService) {}
    
    public getPropertyModel(long: Number, lat: Number) {
        const _url = `${environment.server.url}/properties?lat=${lat}&long=${long}`;
        if (this.mapViewService.isBeingFiltered) {
            return this.http.post(_url,  { "filters": this.mapViewService.filterBody });                
        } else {
            return this.http.post(_url, {});                
        }
    }

    public setProperty (property) {
        this.toView = property;
    }
    
    public viewProperty(propertyId: string) {
        this.isViewingShortList = true;
        const _url = `${environment.server.url}/shortlist/property/get?username=${ this.auth.getLoggedInUser() }&propertyid=${ propertyId }`;

        return this.http.get(_url);
    }

    public getShortListProperty () {
        return this.toView;
    }

    public pullSalesHistory (lat: string, long: string) {
        const _url = `${environment.server.url}/sale-history?lat=${ lat }&long=${ long }&radius=${ 20 }`;
        
        return this.http.get(_url);
    }

    public setSalesHistory (salesHistory) {
        this.saleHistory = salesHistory;
    }

    public getSalesHistory(): any {
        return this.saleHistory;
    }
}
