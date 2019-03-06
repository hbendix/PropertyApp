import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as appSettings from "tns-core-modules/application-settings";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    authObservable = new Subject();

    loggedIn: boolean;
    token: string;

    public isLoggedIn (): boolean {
        return this.loggedIn;
    }

    public logIn (token: string, username: string) {
        appSettings.setBoolean('loggedIn', true);
        appSettings.setString('token', token);
        appSettings.setString('username', username);

        this.token = token;
        this.loggedIn = appSettings.getBoolean('loggedIn');

        this.authObservable.next(true);
    }

    public logOut () {
        appSettings.clear();
        this.loggedIn = false;

        this.authObservable.next(false);
    }

    public getUserToken () {
        return this.token;
    }

    public getLoggedInUser(): string {
        return appSettings.getString('username');
    }

}