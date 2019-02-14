import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PropertyViewComponent } from "./components/property-view/property-view.component";
import { NativescriptBottomNavigationModule} from "nativescript-bottom-navigation/angular";
import { RouteReuseStrategy } from "@angular/router";
import { CustomReuseStrategy } from "./custom-resuse-strategy";
import { AreaViewComponent } from "./components/area-view/area-view.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        HttpClientModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativescriptBottomNavigationModule
    ],
    declarations: [
        AppComponent,
        PropertyViewComponent,
        AreaViewComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
    ]
})
export class AppModule { }
