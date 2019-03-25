import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '~/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthService,
        private http: HttpClient) { }

    /**
     * check to see if user is logged in
     * @param route Route attempted to be hit by the user
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.authService.isLoggedIn()) {
            // logged in so return true
            return false;
        }

      
        return new Promise<boolean>((resolve, reject) => {
            this.http.get(`${ environment.server.url }/auth/validate?secret_token=${ this.authService.getUserToken() }`)
                .subscribe((res) => {
                    if(res.toString() === 'true') {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
        });
    }
}
