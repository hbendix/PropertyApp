import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { PropertyViewService } from "../../services/property-view.service";
import { PropertyView } from "../../models/property";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { registerElement } from 'nativescript-angular/element-registry';
import { ItemEventData } from "tns-core-modules/ui/list-view"
import { NotificationService } from "~/app/services/notification.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { ShortlistService } from "~/app/services/shortlist.service";
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { Image } from 'tns-core-modules/ui/image';
import { View } from 'tns-core-modules/ui/core/view';
import { AuthService } from "~/app/services/auth.service";
registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
  selector: "ns-property-view",
  templateUrl: "./property-view.component.html",
  styleUrls: ["./property-view.component.css"],
  moduleId: module.id
})
export class PropertyViewComponent implements OnInit, OnDestroy {

  @Input()
  private long: Number;
  private lat: Number;
  private prevLocation: String;

  public property: PropertyView;
  public isBusy = true;
  public stats = [];
  public isList = true;
  public propertyList = [];
  public isLoggedIn = this.auth.isLoggedIn();

  constructor(private propertyViewService: PropertyViewService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private notificationService: NotificationService,
    private shortlistService: ShortlistService,
    private auth: AuthService) {
    this.route.queryParams.subscribe(params => {
      this.long = params.long;
      this.lat = params.lat;
      this.prevLocation = params.prevLocation;
    });
    this.loadProperty();
  }

  ngOnInit() {}

  public onNavBtnTap(){
    if ((this.isList) || (this.propertyList.length == 0)) {
      this.propertyViewService.isViewingShortList = false;    
      this.routerExtensions.navigate([this.prevLocation], {
        transition: {
            name: "fade"
        }
      });
    } else {
      this.isList = true;
    }
  }

  private loadProperty () {
    if (this.propertyViewService.isViewingShortList) {
      this.property = this.propertyViewService.toView;
      this.sortStats();
      this.isList = false;
    } else {
      this.propertyViewService.getPropertyModel(this.long, this.lat)
        .subscribe((res) => {
          if (res[1]) {
            this.propertyList = <any>res;
            this.isList = true;
          } else {
            this.property = <any>res[0];
            this.sortStats();
            this.isList = false;
          }
        }, (err) => {
          this.notificationService.fireNotification(`Error getting property: ${ err.status } - ${ err.statusText }`, false); 
          console.log(err);
        }
      );
    }
  }

  private sortStats () {
    this.stats = [];
    if (this.property.bedroomNumber) {
      this.stats.push({
        "name": "Bedrooms",
        "value": this.property.bedroomNumber,
        "icon": "&#xf236;"
      })
    }
    if (this.property.parkingSpaces) {
      this.stats.push({
        "name": "Parking Spaces",
        "value": this.property.parkingSpaces,
        "icon": "&#xf236;"
      })
    }
    if (this.property.bathroomNumber) {
      this.stats.push({
        "name": "Bathrooms",
        "value": this.property.bathroomNumber,
        "icon": "&#xf236;"
      })
    }
  }

  public onItemTap (args: ItemEventData) {
    this.property = this.propertyList[args.index];
    console.log(this.property);
    this.sortStats();
    this.isList = false;
  }

  public saveProperty (property: PropertyView) {

    dialogs.prompt({
        title: "Add a name to Property?",
        okButtonText: "Save",
        cancelButtonText: "Skip",
        inputType: dialogs.inputType.text
      }).then(r => {
        if (r.result) {
          property.propertyName = r.text;
        }

        this.shortlistService.addPropertyToShortList(property)
          .subscribe(
            (res) => {
              this.notificationService.fireNotification('Added to your shortlists!', true);
            }, (err) => {
              this.notificationService.fireNotification(`Error adding to your shortlist ${ err.status } ${ err.statusText }`, true);
            }
          );
      });
  }

  onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View) {
    // If the header content is still visiible
    // console.log(scrollView.verticalOffset);
    if (scrollView.verticalOffset < 250) {
        const offset = scrollView.verticalOffset / 2;
        if (scrollView.ios) {
            // iOS adjust the position with an animation to create a smother scrolling effect. 
            topView.animate({ translate: { x: 0, y: offset } }).then(() => { }, () => { });
        } else {
            // Android, animations are jerky so instead just adjust the position without animation.
            topView.translateY = Math.floor(offset);
        }
    }
}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.propertyViewService.isViewingShortList = false;
    console.log(this.propertyViewService.isViewingShortList);
  }
}
