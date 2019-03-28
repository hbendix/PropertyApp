import {
    Component,
    ElementRef,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import {
    enableLocationRequest,
    getCurrentLocation,
    isEnabled
} from "nativescript-geolocation";
import { MapboxViewApi} from "nativescript-mapbox";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { environment } from "../../../environments/environment";
import { UserLocation } from "../../models/user";
import { PropertyViewService } from "../../services/property-view.service";
import { UserService } from "../../services/user.service";

import * as app from "tns-core-modules/application";
import { NotificationService } from "~/app/services/notification.service";
import { AreaService } from "~/app/services/area.service";
import { TutorialDialogueComponent } from "./tutorial-dialogue/tutorial-dialogue.component";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";

@Component({
    moduleId: module.id,
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit, OnDestroy {
    @Output() mapReady = new EventEmitter<any>();
    @Output() mapSetCenter = new EventEmitter<any>();
    @ViewChild("map") mapbox: ElementRef;
    
    public accessToken: string; // MapBox Api key     
    private userLoc = new UserLocation(0, 0); // long and lat
    private map: MapboxViewApi;
    // mapMarkers: any;

    constructor(public propertyViewService: PropertyViewService, 
        private routerExtensions: RouterExtensions,
        private userService: UserService,
        private notificationService: NotificationService,
        private areaService: AreaService,
        private _activeRoute: ActivatedRoute,
        private modalService: ModalDialogService,
        private vcRef: ViewContainerRef) {
    }

    ngOnInit(): void {
        this.accessToken = environment.mapbox.accessToken;
        this.notificationService.loader.hide();
        if (!isEnabled()) {
            enableLocationRequest();
        }
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onMapReady(args: any): void {
        this.mapReady.emit(args.map);
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
                this.mapSetCenter.emit(loc);
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
            this.getArea();
        });
    }

    getArea() {
        this.userService.updateUserLocation(this.userLoc);
        this.areaService.pullArea(this.userLoc.latitude, this.userLoc.longitude).subscribe((area) => {
            this.areaService.area = area;
            this.showAreaView(this.userLoc.latitude, this.userLoc.longitude);
        }, (err) => {
            this.notificationService.loader.hide();
            if (err.status === 404) {
                this.notificationService.fireNotification(`No area data found!`, false);
            } else {
                this.notificationService.fireNotification(`Error loading Area: ${ err.status } ${ err.statusText }`, false);
            }
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

    ngOnDestroy(): void {
        this.map.destroy();
    }

    setMap(map) {
        this.map = map;
    }
}
