import { Component, OnInit, Input } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { User } from "~/app/models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "~/app/services/user.service";
import { NotificationService } from "~/app/services/notification.service";

@Component({
    selector: "ns-create-account",
    templateUrl: "./create-account.component.html",
    styleUrls: ["./create-account.component.css"],
    moduleId: module.id
  })

  export class CreateAccountComponent implements OnInit {

    user: User;
    createForm: FormGroup = null;
    
    constructor(private routerExtensions: RouterExtensions,
        private fb: FormBuilder,
        private userService: UserService,
        private notificationService: NotificationService) {}

    ngOnInit(): void {
        this.createForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });
    }

    public onNavBtnTap() {
        this.routerExtensions.navigate(['home'], {
            transition: {
                name: "fade"
            }
        });
    }

    public create () {
        if ((this.createForm.valid) && (this.password.value === this.confirmPassword.value)) {
            let _user = this.createForm.value;
            // this.user = new User (_user.username, _user.password);
            this.userService.createUser(this.user)
            .subscribe(
                (res) => {
                    this.notificationService.fireNotification('Created accounted successfully! 😍 Please login. ✍️', true); 
                    this.routerExtensions.navigate(['home'], {
                        transition: {
                            name: "fade"
                        }
                    });
                }, (err) => {
                    this.notificationService.fireNotification(`Error creating account: ${ err.status } - ${ err.statusText }`, false); 
                }
            );
        } else {
            this.notificationService.fireNotification('Error with your details! 😬', false); 
        }
    }

    get username() {
        return this.createForm.get('username');
    }
    get password() {
        return this.createForm.get('password');
    }
    get confirmPassword() {
        return this.createForm.get('confirmPassword');
    }

  }