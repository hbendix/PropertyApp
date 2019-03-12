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

}