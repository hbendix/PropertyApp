import { Injectable } from "@angular/core";
import { PropertyView } from "../models/property";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { AuthService } from "./auth.service";
import { map } from 'rxjs/operators';
import { ShortListItem } from "../models/shortlistItem";
@Injectable({
    providedIn: "root"
})

export class ShortlistService {
  

    constructor (private http: HttpClient,
        private auth: AuthService) {}

    public addPropertyToShortList (property: PropertyView) {
        const _url = `${ environment.server.url }/shortlist/add`;
        const toSend = {
            'username': this.auth.getLoggedInUser(),
            'property': property
        };

        return this.http.post(_url, toSend)
    }

    public getShortlist () {
        const _url = `${ environment.server.url }/shortlist/get?username=${ this.auth.getLoggedInUser() }`;
        
        return this.http.get(_url).pipe(map(res => <ShortListItem[]>res));
    }

    public addComment(propertyId: string, comment: string): any {
        const _url = `${ environment.server.url }/shortlist/note/add`;

        const body = {
            "username": this.auth.getLoggedInUser(),
            "propertyid": propertyId,
            "note": comment
        };

        return this.http.post(_url, body);
    }

    public updateComment(note, propertyId, comment: any): any {
        const _url = `${ environment.server.url }/shortlist/note/update`;

        const body = {
            "username": this.auth.getLoggedInUser(),
            "propertyid": propertyId,
            "note": comment,
            "noteid": note._id
        };

        return this.http.post(_url, body);
    }

    public deleteNote (note, propertyId) {
        const _url = `${ environment.server.url }/shortlist/note/delete`;

        const body = {
            "username": this.auth.getLoggedInUser(),
            "propertyid": propertyId,
            "noteid": note._id
        };

        return this.http.post(_url, body);
    }
}