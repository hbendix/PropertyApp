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
import { MapboxViewApi, Viewport as MapboxViewport } from "nativescript-mapbox";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { environment } from "../../../environments/environment";
import { IUserLocation } from "../../models/user";
import { PropertyViewService } from "../../services/property-view.service";

import * as app from "tns-core-modules/application";

registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    @ViewChild("map") mapbox: ElementRef;

    userLoc: IUserLocation;
    accessToken: string;
    propertyLoad = false;
    private map: MapboxViewApi;

    constructor(public propertyViewService: PropertyViewService) {
        // Use the component constructor to inject providers.
        this.accessToken = environment.mapbox.accessToken;
    }

    ngOnInit(): void {
        if (!isEnabled()) {
            enableLocationRequest();
        }
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onMapReady(args: any) {
        this.map = args.map;
        console.log(this.map);
        // const i = this.getUserLocation();
        // console.log("i: ", i);
        // this.mapbox.nativeElement.setViewport(
        //     {
        //         center: {
        //             lat: i.latitude,
        //             lng: i.longitude
        //         },
        //         animated: true // default true
        //     }
        // );
        this.map.addMarkers([
            {
                id: 1,
                lat: 53.369690,
                lng: -1.491650,
                onTap: () => {
                    this.showPropertyView();
                }
            }
        ]);
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

    showPropertyView() {
        this.propertyLoad = true;
        const property = this.propertyViewService.getPropertyModel();
        console.log(this);
    }
}
