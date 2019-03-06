import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from "./app-routing.module";
import { RouteReuseStrategy } from "@angular/router";
import { CustomReuseStrategy } from "./custom-resuse-strategy";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativescriptBottomNavigationModule} from "nativescript-bottom-navigation/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { AppComponent } from "./app.component";
import { PropertyViewComponent } from "./components/property-view/property-view.component";
import { AreaViewComponent } from "./components/area-view/area-view.component";
import { ShortlistsComponent } from "./components/shortlists/shortlists.component";
import { CreateAccountComponent } from "./components/create-account/create-account.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        HttpClientModule,
        FormsModule, 
        ReactiveFormsModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativescriptBottomNavigationModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AppComponent,
        PropertyViewComponent,
        AreaViewComponent,
        ShortlistsComponent,
        CreateAccountComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
    ]
})
export class AppModule { }
