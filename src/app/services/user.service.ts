import { Injectable } from '@angular/core';
import { UserLocation } from '../models/user';
import { getCurrentLocation } from 'nativescript-geolocation';
import { ShortListItem } from '../models/shortlistItem';

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

    getShortlists(): ShortListItem[] {
        let  toReturn: ShortListItem[] = [];
        for (let index = 0; index < 15; index++) {
            const element = new ShortListItem(
                "1d2d3f45gudg",
                "Porter Brook 2, 3 Pomona Street, S11",
                (7000 * index),
                "https://imgs.nestimg.com/medium/flatapartment_111025159487971389.jpg",

            );
            toReturn.push(element);
            
        }
        return toReturn;
    }

}