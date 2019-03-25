import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { PropertyViewComponent } from "../app/components/property-view/property-view.component";
import { FilterViewComponent } from "../app/components/filter-view/filter-view.component";
import { AreaViewComponent } from "./components/area-view/area-view.component";
import { ShortlistsComponent } from "./components/shortlists/shortlists.component";
import { CreateAccountComponent } from "./components/create-account/create-account.component";
import { PropertySearchViewComponent } from "./components/property-search/property-search.component";
import { TutorialDialogueComponent } from "./components/home/tutorial-dialogue/tutorial-dialogue.component";
import { HomeComponent } from "./components/home/home.component";
import { AuthGuard } from "./guard/auth.guard";
import { LoginComponent } from "./components/login/login.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent,
        children: [ 
            {
                path: "tutorial", component: TutorialDialogueComponent
            }
        ] 
    },
    { path: "search", loadChildren: "~/app/components/search/search.module#SearchModule" },
    { path: "settings", loadChildren: "~/app/components/settings/settings.module#SettingsModule" },
    { path: "property", component: PropertyViewComponent },
    { path: "filter", component: FilterViewComponent },
    { path: "property-search", component: PropertySearchViewComponent },
    { path: "area", component: AreaViewComponent },
    { path: "shortlists", component: ShortlistsComponent, canActivate: [AuthGuard] },
    { path: "create", component: CreateAccountComponent },
    { path: "login", component: LoginComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
