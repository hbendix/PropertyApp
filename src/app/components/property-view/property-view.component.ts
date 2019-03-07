import { Component, OnInit, Input } from "@angular/core";
import { PropertyViewService } from "../../services/property-view.service";
import { PropertyView } from "../../models/property";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { registerElement } from 'nativescript-angular/element-registry';
import { ItemEventData } from "tns-core-modules/ui/list-view"
import { NotificationService } from "~/app/services/notification.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { ShortlistService } from "~/app/services/shortlist.service";

registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
  selector: "ns-property-view",
  templateUrl: "./property-view.component.html",
  styleUrls: ["./property-view.component.css"],
  moduleId: module.id
})
export class PropertyViewComponent implements OnInit {

  @Input()
  private long: Number;
  private lat: Number;
  private prevLocation: String;

  public property: PropertyView;
  public isBusy = true;
  public stats = [];
  public isList = true;
  public propertyList = [];

  constructor(private propertyViewService: PropertyViewService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private notificationService: NotificationService,
    private shortlistService: ShortlistService) {
    this.route.queryParams.subscribe(params => {
      this.long = params.long;
      this.lat = params.lat;
      this.prevLocation = params.prevLocation;
    });
    this.loadProperty();
  }

  ngOnInit() {
    
  }

  public onNavBtnTap(){
    if ((this.isList) || (this.propertyList.length == 0)) {
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

  private sortStats () {
    this.stats = [];

    

    if (this.property.bedroomNumber > 0) {
      this.stats.push({
        "name": "Bedrooms",
        "value": this.property.bedroomNumber,
        "icon": "&#xf236;"
      })
    }
    if (this.property.parkingSpaces > 0) {
      this.stats.push({
        "name": "Parking Spaces",
        "value": this.property.parkingSpaces,
        "icon": "&#xf236;"
      })
    }
    if (this.property.bathroomNumber > 0) {
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
    console.log(property);

    dialogs.prompt({
        title: "Add a name to Property?",
        okButtonText: "Save",
        cancelButtonText: "Skip",
        inputType: dialogs.inputType.text
      }).then(r => {
        if (r.result) {
          property.propertyName = r.text;
        }

        this.shortlistService.addPropertyToShortList(property);
      });
  }
}
