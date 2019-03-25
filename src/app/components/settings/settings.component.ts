import {Component, OnInit} from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import {AccessbilityService} from "~/app/services/accessbility.service";
import {Switch} from "tns-core-modules/ui/switch";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html"
})
export class SettingsComponent implements OnInit {
    isLargerFontChecked = false;
    isFontFamilyChecked = false;
    largerFontSwitch;
    fontFamilySwitch;

    constructor(private accessibilityService: AccessbilityService, private router: RouterExtensions) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.isLargerFontChecked = this.accessibilityService.IsFontSizeLargerEnabled();
        this.isFontFamilyChecked = this.accessibilityService.IsDyslexicFontEnabled();
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    ToggleLargerFont(args) {
        this.largerFontSwitch = <Switch>args.object;
        if (this.largerFontSwitch.checked) {
            this.accessibilityService.SetGlobalFontSize(22);
            this.isLargerFontChecked = true;
            this.router.frameService.getFrame()._onCssStateChange();
        } else {
            this.accessibilityService.SetGlobalFontSize(18);
            this.isLargerFontChecked = false;
            this.router.frameService.getFrame()._onCssStateChange();
        }
    }

    ToggleDyslexicFont(args) {
        this.fontFamilySwitch = <Switch>args.object;
        if (this.fontFamilySwitch.checked) {
            this.accessibilityService.SetGlobalFont("'Verdana'");
            this.isFontFamilyChecked = true;
            this.router.frameService.getFrame()._onCssStateChange();
        } else {
            this.accessibilityService.SetGlobalFont("'Roboto Condensed'");
            this.isFontFamilyChecked = false;
            this.router.frameService.getFrame()._onCssStateChange();
        }
    }
}
