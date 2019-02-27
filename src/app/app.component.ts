import { Component, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import * as application from "tns-core-modules/application";
import * as traceModule from "tns-core-modules/trace"
import * as dialogs from "tns-core-modules/ui/dialogs";
traceModule.enable();

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;

    constructor(private router: Router, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.
    }

    ngOnInit(): void {
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    login () {
        dialogs.login({
            title: "Login",
            okButtonText: "Submit",
            cancelButtonText: "Create Account",
            neutralButtonText: "Close",
            userName: "",
            password: ""
        }).then(r => {
            if (!r.result) {
                this.routerExtensions.navigate(['create'], {
                    transition: {
                        name: "fade"
                    }
                });
                const sideDrawer = <RadSideDrawer>app.getRootView();
                sideDrawer.closeDrawer();
            } else {
                const user = {
                    userName: r.userName,
                    password: r.password
                }
                console.log(user);
            }
        });
    }
}
