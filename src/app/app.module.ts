import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PropertyViewComponent } from "./components/property-view/property-view.component";
import { FilterViewComponent } from "./components/filter-view/filter-view.component";
import { NativescriptBottomNavigationModule} from "nativescript-bottom-navigation/angular";
import { RouteReuseStrategy } from "@angular/router";
import { CustomReuseStrategy } from "./custom-resuse-strategy";

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
        FilterViewComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
    ]
})
export class AppModule { }
