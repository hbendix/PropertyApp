import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { PropertyViewComponent } from "../app/components/property-view/property-view.component";
import { FilterViewComponent } from "../app/components/filter-view/filter-view.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/components/home/home.module#HomeModule" },
    { path: "search", loadChildren: "~/app/components/search/search.module#SearchModule" },
    { path: "settings", loadChildren: "~/app/components/settings/settings.module#SettingsModule" },
    { path: "property", component: PropertyViewComponent },
    { path: "filter", component: FilterViewComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
