import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NSLocationStrategy } from 'nativescript-angular/router/ns-location-strategy';
import { NSRouteReuseStrategy } from 'nativescript-angular/router/ns-route-reuse-strategy';

@Injectable()
export class CustomReuseStrategy extends NSRouteReuseStrategy {

    constructor(location: NSLocationStrategy) {
        super(location);
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot) {
        let shouldReuse = super.shouldReuseRoute(future, current);
        if (shouldReuse && current.data.noReuse) {
            shouldReuse = false;
        }

        console.log(`Should Reuse: ${shouldReuse}`);
        return shouldReuse;
    }
}