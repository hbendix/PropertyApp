import { Component, OnInit, Input } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-create-account",
    templateUrl: "./create-account.component.html",
    styleUrls: ["./create-account.component.css"],
    moduleId: module.id
  })

  export class CreateAccountComponent implements OnInit {

    album: { bandName: string, albumName: string, year: string, owned: boolean, myRating: string} = {
        bandName: "Ed Sheeran",
        albumName: "X",
        year: "2017",
        owned: true,
        myRating: "9.5"
    };
    constructor(private routerExtensions: RouterExtensions) {}

    ngOnInit(): void {

    }

    public onNavBtnTap() {
        this.routerExtensions.navigate(['home'], {
            transition: {
                name: "fade"
            }
        });
    }

  }