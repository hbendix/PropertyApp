import { Component, OnInit, Input } from "@angular/core";
import { PropertyViewService } from "../../services/property-view.service";
import { PropertyView } from "../../models/property";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { registerElement } from 'nativescript-angular/element-registry';
registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
  selector: "ns-property-view",
  templateUrl: "./property-view.component.html",
  styleUrls: ["./property-view.component.css"],
  moduleId: module.id
})
export class PropertyViewComponent implements OnInit {

  @Input()
  long: Number;
  lat: Number;
  prevLocation: String;

  property: PropertyView;
  isBusy = true;
  stats = [];

  constructor(private propertyViewService: PropertyViewService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions) {
    this.route.queryParams.subscribe(params => {
      this.long = params.long;
      this.lat = params.lat;
      this.prevLocation = params.prevLocation;
    });
    console.log(`Long: ${this.long}, Lat: ${this.lat}`);
    this.loadProperty();
  }

  ngOnInit() {
    
  }

  onNavBtnTap(){
    this.routerExtensions.navigate([this.prevLocation], {
      transition: {
          name: "fade"
      }
    });
  }

  private loadProperty () {
    this.propertyViewService.getPropertyModel(this.long, this.lat)
      .subscribe((res) => {
        console.log(res);
        this.property = <any>res[0];
        this.isBusy = false;        
        this.stats = [         
          {
            "name": "Bedroom Count",
            "value": this.property.bedroomNumber,
            "icon": "&#xf236;"
          },
          {
            "name": "Parking Spaces",
            "value": this.property.parkingSpaces,
            "icon": "&#xf236;"
          },
        ]
        if (this.property.bathroomNumber > 0) {
          this.stats.push({
            "name": "Bathroom Count",
            "value": this.property.bathroomNumber,
            "icon": "&#xf236;"
          })
        }
      }, (err) => {
        console.log(`Error retrieving Property: ${err}`);
      }
    );
  }
}
