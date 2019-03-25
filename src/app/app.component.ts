import { Component, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import * as application from "tns-core-modules/application";
import * as traceModule from "tns-core-modules/trace"
import * as dialogs from "tns-core-modules/ui/dialogs";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { User } from "./models/user";
import { NotificationService } from "./services/notification.service";
traceModule.enable();

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    private isLoggedIn: boolean;
    
    public username = "";

    constructor(private router: Router, 
        private routerExtensions: RouterExtensions,
        private authService: AuthService,
        private userService: UserService,
        private notificationService: NotificationService) {
        this.isLoggedIn = this.authService.isLoggedIn();

        if (this.isLoggedIn) {
            this.username = this.authService.getLoggedInUser();
        }
        // Use the component constructor to inject services.
    }

    ngOnInit(): void {
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);

        this.authService.authObservable.subscribe(action => {
            this.isLoggedIn = this.authService.isLoggedIn();

            if (action) {
                this.username = this.authService.getLoggedInUser();
            }
        });
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

        
        // let options = {
        //     title: "Login",
        //     message: "Please enter your username then your password.",
        //     okButtonText: "Login",
        //     neutralButtonText: "Create An Account",
        //     cancelButtonText: "Close",
        //     defaultText: "Enter your username...",
        //     userNameHint: "Enter your username",
        //     passwordHint: "Enter your password",
        //     userName: "",
        //     password: ""
        // }
        // dialogs.login(options).then(r => {
        //     console.log(r.result);
        //     if (r.result === undefined) {
        //         this.routerExtensions.navigate(['create'], {
        //             transition: {
        //                 name: "fade"
        //             }
        //         });
        //         const sideDrawer = <RadSideDrawer>app.getRootView();
        //         sideDrawer.closeDrawer();
        //     } else if (r.result) {
        //         if ((r.userName === '') || (r.password === '')) {
        //             return this.notificationService.fireNotification(`Missing details. 🤔`, false);
        //         }

        //         let user = new User(r.userName, r.password);

        //         this.userService.loginUser(user)
        //         .subscribe(
        //             (res) => {
        //                 this.authService.logIn(res.token, user.username);                        
        //                 this.notificationService.fireNotification(`Successfully logged in! ⭐ Hi ${ user.username } 👋`, true);
        //             }, (err) => {
        //                 this.notificationService.fireNotification(`Error creating account: ${ err.status } - ${ err.statusText }`, false); 
        //             }
        //         );
        //     }
        // });
    }

    logout () {
        console.log('here');
        this.authService.logOut();

        this.notificationService.fireNotification('Successfully logged out! See you soon.', true); 
    }
}
