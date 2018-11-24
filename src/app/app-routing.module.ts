import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/components/home/home.module#HomeModule" },
    { path: "browse", loadChildren: "~/app/components/browse/browse.module#BrowseModule" },
    { path: "search", loadChildren: "~/app/components/search/search.module#SearchModule" },
    { path: "featured", loadChildren: "~/app/components/featured/featured.module#FeaturedModule" },
    { path: "settings", loadChildren: "~/app/components/settings/settings.module#SettingsModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
