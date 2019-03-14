import { Injectable } from '@angular/core';
import { UserLocation, User } from '../models/user';
import { getCurrentLocation } from 'nativescript-geolocation';
import { ShortListItem } from '../models/shortlistItem';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import * as appSettings from "tns-core-modules/application-settings";

@Injectable({
    providedIn: "root"
})
export class UserService {    

    constructor (private http: HttpClient) {}

    userLoc = new UserLocation(0,0);

    public getUserLocation(): UserLocation {
        return this.userLoc;
    }

    public updateUserLocation (userLoc: UserLocation): void {
        this.userLoc = userLoc;
    }

    public createUser(user: User): any {
        const url = `${ environment.server.url }/auth/register`;

        return this.http.post(url, user)
    }

    public loginUser(user: User): any {
        const url = `${ environment.server.url }/auth/login`;

        return this.http.post(url, user);
    }  

}