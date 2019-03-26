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

import { TNSTextToSpeech } from 'nativescript-texttospeech';

import { AppComponent } from "./app.component";
import { PropertyViewComponent } from "./components/property-view/property-view.component";
import { FilterViewComponent } from "./components/filter-view/filter-view.component";
import { PropertySearchViewComponent } from "./components/property-search/property-search.component";
import { AreaViewComponent } from "./components/area-view/area-view.component";
import { ShortlistsComponent } from "./components/shortlists/shortlists.component";
import { CreateAccountComponent } from "./components/create-account/create-account.component";
import { from } from "rxjs";

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
        FilterViewComponent,
        PropertySearchViewComponent,
        AreaViewComponent,
        ShortlistsComponent,
        CreateAccountComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
        TNSTextToSpeech
    ]
})
export class AppModule { }
