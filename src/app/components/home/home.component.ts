import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { registerElement } from "nativescript-angular/element-registry";
import {
    clearWatch,
    distance,
    enableLocationRequest,
    getCurrentLocation,
    isEnabled,
    watchLocation
} from "nativescript-geolocation";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { environment } from "../../../environments/environment";
import { IUserLocation } from "../../models/user";

import * as app from "tns-core-modules/application";

registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    @ViewChild("map") mapbox: ElementRef;

    userLoc: IUserLocation;
    accessToken: string;

    constructor() {
        // Use the component constructor to inject providers.
        this.accessToken = environment.mapbox.accessToken;
    }

    ngOnInit(): void {
        // Init your component properties here.
        if (!isEnabled()) {
            enableLocationRequest();
        }
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onMapReady(args: any) {
        const i = this.getUserLocation();
        console.log(i);
        this.mapbox.nativeElement.setViewport(
            {
                center: {
                    lat: i.latitude,
                    lng: i.longitude
                },
                animated: true // default true
            }
        );
    }

    getUserLocation(): IUserLocation {
        getCurrentLocation({
                desiredAccuracy: 3,
                updateDistance: 10,
                maximumAge: 2000,
                timeout: 2000
            }).then((loc) => {
                if (loc) {
                    console.log("User found: " + loc.latitude + " and " + loc.longitude);
                    this.userLoc.latitude = loc.latitude;
                    this.userLoc.longitude = loc.longitude;
                }
            }, (err) => {
                console.log("Error: " + err);
            });

        return this.userLoc;
    }
}
