import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

import { UserService } from "~/app/services/user.service";
import { Page } from "tns-core-modules/ui/page/page";
import { User } from "~/app/models/user";
import { NotificationService } from "~/app/services/notification.service";
import { AuthService } from "~/app/services/auth.service";

@Component({
  selector: "ns-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  moduleId: module.id
})
export class LoginComponent implements OnInit {
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    isLoggingIn = true;
    user: User;
    processing = false;
    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;

    constructor(private page: Page, 
        private userService: UserService, 
        private routerExtensions: RouterExtensions,
        private notificationService: NotificationService,
        private auth: AuthService) {
        this.page.actionBarHidden = true;
        this.user = new User();
    }

    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    submit() {
        if (!this.user.password) {
            this.notificationService.fireNotification("Please provide a password.", false);
            return;
        }

        if (!this.user.username || this.user.username === '') {
            this.notificationService.fireNotification("Please provide a username.", false);
            return;
        }
        this.user.username = this.user.username.replace(/ /g,'');
        this.processing = true;
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    login() {
        this.userService.loginUser(this.user).subscribe(
            (res) => {
                this.processing = false;
                this.auth.logIn(res.token, this.user.username);
                this.notificationService.fireNotification("Signed in successfully.", true);
                this.routerExtensions.navigate(["/home"], { clearHistory: true });
            }, (err) => {
                this.processing = false;
                this.notificationService.fireNotification("Invalid login.", false);
            }
        )
    }

    register() {
        if (this.user.password != this.user.confirmPassword) {
            this.notificationService.fireNotification("Your passwords do not match.", false);
            this.processing = false;
            return;
        }
        this.userService.createUser(this.user).subscribe(
            (res) => {
                this.processing = false;
                this.notificationService.fireNotification("Your account was successfully created.", true);
                this.isLoggingIn = true;
            }, (err) => {
                this.processing = false;
                this.notificationService.fireNotification("Unfortunately we were unable to create your account.", false);
            });
    }

}