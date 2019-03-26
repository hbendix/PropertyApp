import {Component, OnInit} from "@angular/core";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { AuthService } from "~/app/services/auth.service";
import { User } from "~/app/models/user";
import { UserService } from "~/app/services/user.service";
import { NotificationService } from "~/app/services/notification.service";

@Component({
    selector: "ns-my-account",
    templateUrl: "./my-account.component.html",
    styleUrls: ["./my-account.component.css"],
    moduleId: module.id
})

export class MyAccountComponent implements OnInit {

    isEditing = false;
    user = new User();
    processing: boolean;

    constructor (private auth: AuthService,
        private userService: UserService,
        private notificationService: NotificationService) {
        this.user.username = this.auth.getLoggedInUser();
    }

    ngOnInit() {
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    submit () {
        if (this.isEditing) {
            this.processing = true;
            if (this.user.password) {
                if (this.user.password !== this.user.confirmPassword) {
                    this.notificationService.fireNotification("Your passwords do not match.", false);
                    this.processing = false;
                    
                    return;
                }
            } else {
                this.user.password = null;
            }

            console.log(this.user);

            this.userService.updateUser(this.user).subscribe(
                (res) => {  
                    this.notificationService.fireNotification('Updated your details.', true);
                    this.auth.logIn(res.token, this.user.username);                    
                    this.processing = false;
                    this.isEditing = false;
                }, (err) => {
                    this.notificationService.fireNotification(`Error updating your details: ${ err.status } ${ err.statusText }`, false);
                    this.processing = false;
                }
            )
            console.log(this.user);
        } else {
            this.isEditing = !this.isEditing;
        }
    }
}