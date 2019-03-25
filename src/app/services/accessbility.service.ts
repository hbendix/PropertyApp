import {Injectable, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import * as app from "tns-core-modules/application";
import * as localStorage from "nativescript-localstorage";

@Injectable({
  providedIn: 'root'
})
export class AccessbilityService implements OnInit {
  globalFontSize = "18px";
  globalFont = "'Roboto Condensed'";
  app = null;
  hasCssChanged = new Subject();

  constructor() { }

  ngOnInit(): void {
    this.setAccessibility();
  }

  setAccessibility() {
    if (localStorage.getItem("globalFont") !== null && localStorage.getItem("globalFont") !== undefined) {
      this.globalFont = localStorage.getItem("globalFont");
    }

    if (localStorage.getItem("globalFontSize") !== null && localStorage.getItem("globalFontSize") !== undefined) {
      this.globalFontSize = localStorage.getItem("globalFontSize");
    }
  }

  SetGlobalFontSize(fontSize: number) {
    this.globalFontSize = fontSize + "px";
    localStorage.setItem("globalFontSize", this.globalFontSize);
    const cssToAdd = "* { font-size: " + this.globalFontSize + "; }";
    this.hasCssChanged.next(cssToAdd);
  }

  SetGlobalFont(font: string) {
    this.globalFont = font;
    localStorage.setItem("globalFont", this.globalFont);
    const cssToAdd = "Label, Span, paragraphText, fa, far, fab, fas { font-family: " + this.globalFont + "; }";
    this.hasCssChanged.next(cssToAdd);
  }

  IsFontSizeLargerEnabled(): boolean {
    if (this.globalFontSize !== "18px") {
      return true;
    } else {
      return false;
    }
  }

  IsDyslexicFontEnabled(): boolean {
    if (this.globalFont !== "'Roboto Condensed'") {
      return true;
    } else {
      return false;
    }
  }
}
