import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from "./app-routing.module";
import { RouteReuseStrategy } from "@angular/router";
import { CustomReuseStrategy } from "./custom-resuse-strategy";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativescriptBottomNavigationModule} from "nativescript-bottom-navigation/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";

import { TNSTextToSpeech } from 'nativescript-texttospeech';

import { AppComponent } from "./app.component";
import { PropertyViewComponent } from "./components/property-view/property-view.component";
import { FilterViewComponent } from "./components/filter-view/filter-view.component";
import { PropertySearchViewComponent } from "./components/property-search/property-search.component";
import { AreaViewComponent } from "./components/area-view/area-view.component";
import { ShortlistsComponent } from "./components/shortlists/shortlists.component";
import { CreateAccountComponent } from "./components/create-account/create-account.component";

import { from } from "rxjs";

import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { TutorialDialogueComponent } from "./components/home/tutorial-dialogue/tutorial-dialogue.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import {AccessbilityService} from "~/app/services/accessbility.service";
import {MyAccountComponent} from "~/app/components/my-account/my-account.component";
import { SalesHistoryComponent } from "./components/property-view/sales-history/sales-history.component";
import { ChartDialogueComponent } from "./components/property-view/sales-history/chart-dialogue/chart-dialogue.component";


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        HttpClientModule,
        FormsModule, 
        ReactiveFormsModule,
        NativeScriptCommonModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativescriptBottomNavigationModule,
        NativeScriptFormsModule,
        NativeScriptUIChartModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        PropertyViewComponent,
        FilterViewComponent,
        PropertySearchViewComponent,
        AreaViewComponent,
        ShortlistsComponent,
        CreateAccountComponent,
        TutorialDialogueComponent,
        ChartDialogueComponent,
        LoginComponent,
        MyAccountComponent,
        SalesHistoryComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
        TNSTextToSpeech,
        ModalDialogService,
        AccessbilityService

    ]
})
export class AppModule { }
