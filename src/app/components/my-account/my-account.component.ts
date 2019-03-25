import {Component, OnInit} from "@angular/core";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

@Component({
    selector: "ns-my-account",
    templateUrl: "./my-account.component.html",
    styleUrls: ["./my-account.component.css"],
    moduleId: module.id
})

export class MyAccountComponent implements OnInit {
    ngOnInit() {

    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}