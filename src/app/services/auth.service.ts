import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as appSettings from "tns-core-modules/application-settings";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    authObservable = new Subject();

    public isLoggedIn (): boolean {
        return appSettings.getBoolean('loggedIn');
    }

    public logIn (token: string, username: string) {
        appSettings.setBoolean('loggedIn', true);
        appSettings.setString('token', token);
        appSettings.setString('username', username);

        

        this.authObservable.next(true);
    }

    public logOut () {
        appSettings.clear();
        this.authObservable.next(false);
    }

    public getUserToken () {
        return appSettings.getString('token');
    }

    public getLoggedInUser(): string {
        return appSettings.getString('username');
    }

}