import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { BrowseRoutingModule } from "./map-view-routing.module";
import { MapViewComponent } from "./map-view.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        BrowseRoutingModule
    ],
    declarations: [
        MapViewComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class BrowseModule { }
