import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { RegisterElement } from "nativescript-angular/element-registry";
import * as app from "tns-core-modules/application";

RegisterElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

@Component({
    selector: "Map-View",
    moduleId: module.id,
    templateUrl: "./map-view.component.html"
})
export class MapViewComponent implements OnInit {

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
