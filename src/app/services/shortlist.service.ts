import { Injectable } from "@angular/core";
import { PropertyView } from "../models/property";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { AuthService } from "./auth.service";
import { map } from 'rxjs/operators';
import { ShortListItem, AreaShortListItem } from "../models/shortlistItem";
import { Area } from "../models/area";
@Injectable({
    providedIn: "root"
})

export class ShortlistService {

    constructor (private http: HttpClient,
        private auth: AuthService) {}

    public addPropertyToShortList (property: PropertyView) {
        const _url = `${ environment.server.url }/shortlist/property/add`;
        const toSend = {
            'username': this.auth.getLoggedInUser(),
            'property': property
        };

        return this.http.post(_url, toSend)
    }

    public deletePropertyFromShortlist (propertyId: string) {
        const _url = `${ environment.server.url }/shortlist/property/delete`;

        const body = { 
            "username": this.auth.getLoggedInUser(),
	        "propertyid": propertyId
        }

        return this.http.post(_url, body);
    }

    public getShortlist () {
        const _url = `${ environment.server.url }/shortlist/property/list?username=${ this.auth.getLoggedInUser() }`;
        
        return this.http.get(_url).pipe(map(res => <ShortListItem[]>res));
    }

    public addComment(propertyId: string, comment: string): any {
        const _url = `${ environment.server.url }/shortlist/property/note/add`;

        const body = {
            "username": this.auth.getLoggedInUser(),
            "propertyid": propertyId,
            "note": comment
        };

        return this.http.post(_url, body);
    }

    public updateComment(note, propertyId, comment: any): any {
        const _url = `${ environment.server.url }/shortlist/property/note/update`;

        const body = {
            "username": this.auth.getLoggedInUser(),
            "propertyid": propertyId,
            "note": comment,
            "noteid": note._id
        };

        return this.http.post(_url, body);
    }

    public deleteNote (note, propertyId) {
        const _url = `${ environment.server.url }/shortlist/property/note/delete`;

        const body = {
            "username": this.auth.getLoggedInUser(),
            "propertyid": propertyId,
            "noteid": note._id
        };

        return this.http.post(_url, body);
    }

    public refreshComments (propertyId: string) {
        const _url = `${ environment.server.url }/shortlist/property/note/get?username=${this.auth.getLoggedInUser()}&propertyid=${ propertyId }`;

        return this.http.get(_url);
    }

    public addAreaToShortlist (area: Area) {
        const _url = `${ environment.server.url }/shortlist/area/add`;
        const toSend = {
            'username': this.auth.getLoggedInUser(),
            'area': area
        };

        return this.http.post(_url, toSend)
    }

    public getAreaShortlist() {
        const _url = `${ environment.server.url }/shortlist/area/list?username=${ this.auth.getLoggedInUser() }`;
        
        return this.http.get(_url).pipe(map(res => <AreaShortListItem[]>res));
    }
}