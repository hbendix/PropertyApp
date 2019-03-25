import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { registerElement } from "nativescript-angular/element-registry";
import { RouteReuseStrategy, ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import {
    clearWatch,
    distance,
    enableLocationRequest,
    getCurrentLocation,
    isEnabled,
    watchLocation
} from "nativescript-geolocation";
import { Mapbox, MapStyle, MapboxViewApi, Viewport as MapboxViewport, MapboxView } from "nativescript-mapbox";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { environment } from "../../../environments/environment";
import { UserLocation } from "../../models/user";
import { PropertyViewService } from "../../services/property-view.service";
import { MapViewService } from "../../services/map-view.service";
import { UserService } from "../../services/user.service";
import { View } from 'ui/core/view';

import * as app from "tns-core-modules/application";
import { NotificationService } from "~/app/services/notification.service";
import { AreaService } from "~/app/services/area.service";
import { TutorialDialogueComponent } from "./tutorial-dialogue/tutorial-dialogue.component";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
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
    private mapboxAPI: any;
    // mapMarkers: any;

    constructor(public propertyViewService: PropertyViewService, 
        private routerExtensions: RouterExtensions,
        private mapViewService: MapViewService,
        private userService: UserService,
        private notificationService: NotificationService,
        private areaService: AreaService,
        private _activeRoute: ActivatedRoute,
        private modalService: ModalDialogService,
        private vcRef: ViewContainerRef) {
        this.accessToken = environment.mapbox.accessToken;
        this.getUserLocation();
        this.mapboxAPI = new Mapbox();
        this.notificationService.loader.hide();
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
                this.notificationService.fireNotification(`Error getting markers: ${ err.status } - ${ err.statusText }`, false); 
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
                    iconPath: 'res/markers/green_pin_marker.png',
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
        this.notificationService.loader.show();
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

    onFilterTap() {
        this.showFilterView();
    }

    onCurrentTap() {
        if (!isEnabled()) {
            enableLocationRequest();
        }
        getCurrentLocation({
            desiredAccuracy: 3,
            updateDistance: 10,
            maximumAge: 2000,
            timeout: 2000
        }).then((loc) => {
            if (loc) {
                this.map.setCenter({ lat: loc.latitude, lng: loc.longitude, animated: true });
            }
        }, (err) => {
            console.log("Error: " + err);
        });
    }

    onAreaTap() {
        this.notificationService.loader.show();
        
        this.map.getCenter().then((res) => {
            this.userLoc.longitude =  res.lng;
            this.userLoc.latitude = res.lat;
            this.userService.updateUserLocation(this.userLoc);
            this.areaService.pullArea(res.lat, res.lng).subscribe((area) => {
                console.log(res);
                this.areaService.area = area;
                this.showAreaView(res.lat, res.lng);
            }, (err) => {
                this.notificationService.loader.hide();
                if (err.status === 404) {
                    this.notificationService.fireNotification(`No area data found!`, false);
                } else {
                    this.notificationService.fireNotification(`Error loading Area: ${ err.status } ${ err.statusText }`, false);
                }

            });
        });
    }

    showFilterView(): void {
        this.routerExtensions.navigate(["/filter"], {
            transition: {
                name: "fade"
            },
            queryParams: {
                "prevLocation": "/home",
            }
        });
    }

    showPropertySearchView(): void {
        this.routerExtensions.navigate(["/property-search"], {
            transition: {
                name: "fade"
            },
            queryParams: {
                "prevLocation": "/home"
            }
        });
    }

    showAreaView(lat, lng): void {
        console.log(lat, lng);
        this.routerExtensions.navigate(["/area"], {
            transition: {
                name: "fade"
            },
            queryParams: {
                "prevLocation": "/home",        
                "long": lng,
                "lat": lat
            }
        });
    }

    showTutorial () {

        const options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            fullscreen: false,
        };

        this.modalService.showModal(TutorialDialogueComponent, options)
            .then((result: string) => {
                console.log(result);
            }
        );
    }
}
