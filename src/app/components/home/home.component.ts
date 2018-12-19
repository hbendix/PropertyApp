import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { registerElement } from "nativescript-angular/element-registry";
import { RouteReuseStrategy } from "@angular/router";
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
import { UserLocation } from "../../models/user";
import { PropertyViewService } from "../../services/property-view.service";
import { BottomNavigation, BottomNavigationTab, OnTabPressedEventData, OnTabSelectedEventData } from 'nativescript-bottom-navigation';
import { MapViewService } from "../../services/map-view.service";
import { UserService } from "../../services/user.service";

import * as app from "tns-core-modules/application";

registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

@Component({
    moduleId: module.id,
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit  {

    @ViewChild("map") mapbox: ElementRef;
    
    public accessToken: string; // MapBox Api key     
    private userLoc = new UserLocation(0, 0); // long and lat
    private map: MapboxViewApi;
    // mapMarkers: any;

    constructor(public propertyViewService: PropertyViewService, 
        private routerExtensions: RouterExtensions,
        private mapViewService: MapViewService,
        private userService: UserService) {
        this.accessToken = environment.mapbox.accessToken;
        this.getUserLocation();
        // const m = this.mapViewService.getMapMarkers();
        // console.log(m);
        // if (typeof m !== 'undefined') {
        //     this.mapMarkers.push(this.mapViewService.getMapMarkers());
        // }
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

    onMapReady(args: any): void {
        this.map = args.map;
        if (this.userLoc.latitude > 0) {
            this.map.setCenter({
                lat: this.userLoc.latitude,
                lng: this.userLoc.longitude
            })
        } else {
            this.userLoc.longitude = -1.491650;
            this.userLoc.latitude = 53.369690;
        }        

        this.getMapMarkers(this.userLoc.longitude, this.userLoc.latitude);

        this.map.setOnMapLongClickListener((point: any) => {
            this.userLoc.longitude =  point.lng;
            this.userLoc.latitude = point.lat;
            this.userService.updateUserLocation(this.userLoc);
            this.getMapMarkers(point.lng, point.lat);            
        });
    }

    getMapMarkers (long, lat): void {        
        this.displayMarkers(this.mapViewService.pullMapMarkers(long, lat, 2000)
            .subscribe((res) => {
                this.displayMarkers(res);
            },
            (err) => {
                console.log(err);
            })
        )        
    }

    displayMarkers(response): void {
        // this.mapMarkers.push(response);
        // this.mapViewService.saveMapMarkers(response);
        // console.log('mapmarkers', this.mapViewService.getMapMarkers());
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

    getUserLocation(): UserLocation {
        if (this.userService.getUserLocation().latitude > 0) {
            this.userLoc.latitude = this.userService.getUserLocation().latitude;
            this.userLoc.longitude = this.userService.getUserLocation().longitude;
            return this.userLoc;
        } else {
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
    }

    showPropertyView(marker: any): void {
        this.userLoc.longitude =  marker.lng;
        this.userLoc.latitude = marker.lat;
        this.userService.updateUserLocation(this.userLoc);

        this.routerExtensions.navigate(["/property"], {
            transition: {
                name: "fade"
            },
            queryParams: {
                "lat": marker.lat,
                "long": marker.lng,
                "prevLocation": "/home"
            }
        });
    }
}
