import { Component, OnInit} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import * as traceModule from "tns-core-modules/trace";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { UserLocation} from "./models/user";
import { NotificationService } from "./services/notification.service";
import {AccessbilityService} from "~/app/services/accessbility.service";
import {Mapbox, MapboxViewApi, MapboxView } from "nativescript-mapbox";
import {MapViewService} from "~/app/services/map-view.service";
import {getCurrentLocation} from "nativescript-geolocation";
import {HomeComponent} from "~/app/components/home/home.component";
traceModule.enable();
import {registerElement} from "nativescript-angular/element-registry";
registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    private isLoggedIn: boolean;
    public username = "";
    public globalFontSize;
    public globalFont;
    private mapboxAPI: any;
    private mapboxView: MapboxView;
    private userLoc = new UserLocation(0, 0); // long and lat
    private map: MapboxViewApi;
    private homeComponent;

    constructor(private mapViewService: MapViewService,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private authService: AuthService,
                private userService: UserService,
                private notificationService: NotificationService,
                private accessibilityService: AccessbilityService) {
        this.isLoggedIn = this.authService.isLoggedIn();

        if (this.isLoggedIn) {
            this.username = this.authService.getLoggedInUser();
        }
        // Use the component constructor to inject services.
    }

    ngOnInit(): void {
        this.mapboxAPI = new Mapbox();
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();
        this.accessibilityService.setAccessibility();
        this.globalFont = this.accessibilityService.globalFont;
        this.globalFontSize = this.accessibilityService.globalFontSize;
        this.getUserLocation();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);

        this.authService.authObservable.subscribe(action => {
            this.isLoggedIn = this.authService.isLoggedIn();

            if (action) {
                this.username = this.authService.getLoggedInUser();
            }
        });

        this.accessibilityService.hasCssChanged.subscribe((newCss: string) => {
            app.addCss(newCss);
            this.routerExtensions.frameService.getFrame()._onCssStateChange();
            this.globalFont = this.accessibilityService.globalFont;
            this.globalFontSize = this.accessibilityService.globalFontSize;
        });
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    logout () {
        console.log('here');
        this.authService.logOut();

        this.notificationService.fireNotification('Successfully logged out! See you soon.', true); 
    }

    onRouterOutletActivate(event) {
        // Access Home.component.ts map via: event.map
        if (event.constructor.name === "HomeComponent") {
            this.homeComponent = event;
            event.mapReady.subscribe((res) => {
                if (this.map === undefined) {
                    this.map = res;
                    this.initialiseMapForFirstTime();
                } else {
                    this.map.getZoomLevel().then((zoomLevel) => {
                        this.map = res;
                        this.reloadMap(zoomLevel);
                    });
                }
                event.setMap(this.map);
            });

            event.mapSetCenter.subscribe((loc) => {
                this.map.setCenter({ lat: loc.latitude, lng: loc.longitude, animated: true });
            });
        }
    }

    initialiseMapForFirstTime() {
        if (this.userLoc.latitude > 0) {
            this.map.setCenter({
                lat: this.userLoc.latitude,
                lng: this.userLoc.longitude
            });
        } else {
            this.userLoc.longitude = -1.491650;
            this.userLoc.latitude = 53.369690;
        }

        if (this.mapViewService.mapMarkers.length > 0) {
            this.loadExisting(this.mapViewService.mapMarkers);
        } else {
            this.getMapMarkers(this.userLoc.longitude, this.userLoc.latitude);
        }

        this.map.setOnMapLongClickListener((point: any) => {
            this.userLoc.longitude =  point.lng;
            this.userLoc.latitude = point.lat;
            this.userService.updateUserLocation(this.userLoc);
            this.getMapMarkers(point.lng, point.lat);
        });
    }

    reloadMap(zoomLevel) {
        this.map.setCenter({
            lat: this.userLoc.latitude,
            lng: this.userLoc.longitude
        });

        this.map.setZoomLevel({
            level: zoomLevel,
            animated: false
        });

        if (this.mapViewService.mapMarkers.length > 0) {
            this.loadExisting(this.mapViewService.mapMarkers);
        } else {
            this.getMapMarkers(this.userLoc.longitude, this.userLoc.latitude);
        }

        this.map.setOnMapLongClickListener((point: any) => {
            this.userLoc.longitude =  point.lng;
            this.userLoc.latitude = point.lat;
            this.userService.updateUserLocation(this.userLoc);
            this.getMapMarkers(point.lng, point.lat);
        });
    }

    getMapMarkers (long, lat): void {
        this.displayMarkers(this.mapViewService.pullMapMarkers(long, lat, 1000)
            .subscribe((res) => {
                    this.displayMarkers(res);
                },
                (err) => {
                    this.notificationService.fireNotification(`Error getting markers: ${ err.status } - ${ err.statusText }`, false);
                    console.log(err);
                })
        )
    }

    loadExisting(markers) {
        let i = 0;
        for (const marker of markers) {
            i++;
            this.map.addMarkers([
                {
                    id: i,
                    lat: marker.lat,
                    lng: marker.long,
                    icon: marker.hasMultiple ? "res://ic_red_marker" : "res://ic_green_pin",
                    onTap: (marker) => {
                        this.userLoc.longitude =  marker.lng;
                        this.userLoc.latitude = marker.lat;
                        this.homeComponent.showPropertyView(marker);
                    }
                }
            ]);
        }
    }

    displayMarkers(response): void {
        let i = 0;
        for (const marker of response) {
            // if (this.mapViewService.mapMarkers.includes(marker.lat) )
            if (this.mapViewService.mapMarkers.length > 0) {
                const lat = this.mapViewService.mapMarkers.findIndex(m => m.lat === marker.lat);
                const long = this.mapViewService.mapMarkers.findIndex(m => m.long === marker.long);
                if (lat !== -1 && long !== -1) {
                    return;
                }
            }
            i++;
            this.map.addMarkers([
                {
                    id: i,
                    lat: marker.lat,
                    lng: marker.long,
                    icon: marker.hasMultiple ? "res://ic_red_marker" : "res://ic_green_pin",
                    onTap: (marker) => {
                        this.userLoc.longitude =  marker.lng;
                        this.userLoc.latitude = marker.lat;
                        this.homeComponent.showPropertyView(marker);
                    }
                }
            ]);

            // newMarkers.push(marker);
            this.mapViewService.saveMapMarkers(marker);
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
}
