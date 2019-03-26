import { SnackBar, SnackBarOptions } from "nativescript-snackbar";
import { Injectable, OnInit } from "@angular/core";
import { LoadingIndicator } from 'nativescript-loading-indicator';

@Injectable({
    providedIn: "root"
})

export class NotificationService {

    snackbar = new SnackBar();
    public loader = new LoadingIndicator();
    /**
     * displays a snackbar at the bottom of the screen
     * @param message message to be displayed
     * @param success if it's a success message or not
     */
    public fireNotification (message: string, success: boolean) {
        let colour = '#2e7d32';
        if (!success) {
            colour = '#C62828';
        }
        this.snackbar.simple(message, 'white', colour, 3, false).then(args => {});
    }
}