import { Injectable } from '@angular/core';
import { UserLocation } from '../models/user';
import { getCurrentLocation } from 'nativescript-geolocation';

@Injectable({
    providedIn: "root"
})
export class UserService {

    userLoc = new UserLocation(0,0);

    getUserLocation(): UserLocation {
        return this.userLoc;
    }

    updateUserLocation (userLoc: UserLocation): void {
        this.userLoc = userLoc;
    }

}