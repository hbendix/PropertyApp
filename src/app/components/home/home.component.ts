import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { registerElement } from "nativescript-angular/element-registry";
import { RouterExtensions } from "nativescript-angular/router";
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
import { MapViewService } from "../../services/map-view.service";

import * as app from "tns-core-modules/application";

registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

@Component({
    moduleId: module.id,
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    @ViewChild("map") mapbox: ElementRef;

    userLoc: IUserLocation; // long and lat
    accessToken: string; // MapBox Api key
    private map: MapboxViewApi;

    constructor(public propertyViewService: PropertyViewService, 
        private routerExtensions: RouterExtensions,
        private mapViewService: MapViewService) {
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
        this.mapViewService.getMapMarkers(-1.491650, 53.369690, 2000)
            .subscribe((res) => {
                console.log(res);
                this.displayMarkers(res);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    displayMarkers(response) {
        let i = 0;
        for (const marker of response) {
            i++;
            this.map.addMarkers([
                {
                    id: i,
                    lat: marker.lat,
                    lng: marker.long,
                    onTap: (marker) => {
                        this.showPropertyView(marker);
                    }
                }
            ]);
        }
    }

    getUserLocation(): IUserLocation {
        getCurrentLocation({
                desiredAccuracy: 3,
                updateDistance: 10,
                maximumAge: 2000,
                timeout: 2000
            }).then((loc) => {
                if (loc) {
                    this.userLoc.latitude = loc.latitude;
                    this.userLoc.longitude = loc.longitude;
                }
            }, (err) => {
                console.log("Error: " + err);
            });

        return this.userLoc;
    }

    showPropertyView(marker: any) {
        this.routerExtensions.navigate(["/property"], {
            transition: {
                name: "fade"
            },
            queryParams: {
                "long": marker.lat,
                "lat": marker.lng,
                "prevLocation": "/home"
            }
        });
    }
}
