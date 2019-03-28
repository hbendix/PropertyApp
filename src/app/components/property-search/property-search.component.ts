import { Component, OnInit, Input } from "@angular/core";
import { PropertySearchService } from "../../services/property-search.service";
import { PropertySearchView } from "../../models/propertySearch";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "~/app/services/notification.service";
import { ShortListItem } from "~/app/models/shortlistItem";
import { FilterView, DropDownData } from "~/app/models/filter";
import { PropertyViewService } from "~/app/services/property-view.service";
import * as dialogs from "tns-core-modules/ui/dialogs";

@Component({
  selector: "ns-propertySearch-view",
  templateUrl: "./property-search.component.html",
  styleUrls: ["./property-search.component.css"],
  moduleId: module.id
})
export class PropertySearchViewComponent implements OnInit {

  search: FilterView;
  searchForm: FormGroup = null;
  isValid = true;
  properties: ShortListItem[] = [];
  viewingList = false;
  loading = false;
  minPrice: number = null;
  maxPrice: number = null;

  minBed: number = null;
  maxBed: number = null;

  minBath: number = null;  
  maxBath: number = null;

  minRoom: number = null;
  maxRoom: number = null;

  radius: number = 10;
  errorMsg: string;

  constructor(private searchViewService: PropertySearchService,
    private fb: FormBuilder,
    private routerExtensions: RouterExtensions,
    private notificationService: NotificationService,
    private propertyViewService: PropertyViewService,
    private propertySearchService: PropertySearchService) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      postcode: ['', Validators.required]
    });
    if (this.propertySearchService.getSearchResults() !== undefined) {
      this.properties = this.propertySearchService.getSearchResults();
      this.loading = false;
      this.viewingList = true;
    }

    this.notificationService.loader.hide();
  }

  onNavBtnTap() {
    if (!this.viewingList) {
      this.routerExtensions.navigate(['home'], {
        transition: {
            name: "fade"
        }
      });
    } else {
      this.viewingList = false;
      this.properties = [];
    }
  }

  searchProperties(): void  {

    this.loading = true;
    let _search = this.searchForm.value;
    
    if (!this.searchForm.valid) {
      this.errorMsg = "Postcode must have value "
      this.isValid = false;
      return;
    }
    
    _search.postcode = _search.postcode.replace(/ /g,'');

    const regex = new RegExp("^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$");
    const found = _search.postcode.match(regex);

    if (!found) {
      this.isValid = false;
      this.errorMsg = "Postcode is invalid "
      console.log("ERROR");
      return;
    }

    this.notificationService.loader.show();
    this.search = new FilterView();
    this.search.tags = [];
    
    this.search.bathMax = this.maxBath;
    this.search.bathMin = this.minBath;
    this.search.bedMax = this.maxBed;
    this.search.bedMin = this.minBed;
    this.search.roomMax = this.maxRoom;
    this.search.roomMin = this.minRoom;
    this.search.priceMax = this.maxPrice;
    this.search.priceMin = this.minPrice;
    console.log(_search.postcode);

    if (this.radius === null) {
      this.radius = 10;
    }
    this.searchViewService.getSearch(_search.postcode, this.radius, this.search)
    .subscribe((res) => {
      console.log(res);
      this.properties = <ShortListItem[]>res;
      this.loading = false;
      this.viewingList = true;
      this.notificationService.loader.hide();
      }, (err) => {
        this.notificationService.fireNotification(`Error getting Properties: ${ err.status } ${ err.statusText }`, false);
      }
    );
  }

  showRadiusDialogue () {
    let options = {
      title: "Radius from Postcode in KM",
      cancelButtonText: "Cancel",
      actions: DropDownData.getRadius()
    }
    dialogs.action(options).then(r => {
      if (r !== 'Cancel') {
        r = r.split(" ")[0];
        this.radius = <number><unknown>r;

        console.log(this.radius);
      } else {
        this.radius = null;
      }
    });
  }

  showPriceDialogue (isMax: boolean) {
    let options = {
      title: "Price range",
      cancelButtonText: "Cancel",
      actions: DropDownData.getPriceRange()
    };
    dialogs.action(options).then(r => {
      if (r !== 'Cancel') {
        r = r.replace(/[^a-zA-Z0-9]/g, '');
        let value = <number><unknown>r;
        if (isMax) {
          if (value < this.minPrice) {
            this.notificationService.fireNotification('Max value cannot be less than Min value!', false);
          } else {
            this.maxPrice = value;
          }
        } else {
          if (value > this.maxPrice && this.maxPrice !== null) {
            this.notificationService.fireNotification('Min value cannot be greater than Max value!', false);
          } else {
            this.minPrice = value;
          }
        }
      } else {
        if (isMax) {
          this.maxPrice = null;
        } else {
          this.minPrice = null;
        }
      }
    });
  }

  showCountDialogue (type: string, isMax: boolean) {
    let options = {
      title: `${ type }`,
      cancelButtonText: "Cancel",
      actions: DropDownData.getCounts()
    };
    dialogs.action(options).then(r => {
      console.log(r);
      if (r !== 'Cancel') {
        let value = <number><unknown>r;
        switch (type) {
          case "Beds":
            if (isMax) {
              if (value < this.minBed) {
                this.notificationService.fireNotification('Max value cannot be less than Min value!', false);
              } else {
                this.maxBed = value;
              }
            } else {
              if (value > this.maxBed && this.maxBed !== null) {
                this.notificationService.fireNotification('Min value cannot be greater than Max value!', false);
              } else {
                this.minBed = value;
              }
            }
            break;
          case "Baths":
            if (isMax) {
              if (value < this.minBath) {
                this.notificationService.fireNotification('Max value cannot be less than Min value!', false);
              } else {
                this.maxBath = value;
              }
            } else {
              if (value > this.maxBath && this.maxBath !== null) {
                this.notificationService.fireNotification('Min value cannot be greater than Max value!', false);
              } else {
                this.minBath = value;
              }
            }
            break;
          case "Rooms":
            if (isMax) {
              if (value < this.minRoom) {
                this.notificationService.fireNotification('Max value cannot be less than Min value!', false);
              } else {
                this.maxRoom = value;
              }
            } else {
              if (value > this.maxRoom && this.maxRoom !== null) {
                this.notificationService.fireNotification('Min value cannot be greater than Max value!', false);
              } else {
                this.minRoom = value;
              }
            }
            break;
        }
      } else {
        switch (type) {
          case "Beds":
            if (isMax) {
              this.maxBed = null;
            } else {
              this.minBed = null;
            }
            break;
          case "Baths":
            if (isMax) {
              this.maxBath = null;
            } else {
              this.minBath = null;
            }
            break;
          case "Rooms":
            if (isMax) {
              this.maxRoom = null;
            } else {
              this.minRoom = null;
            }
            break;
        }
        
      }
    });
  }


  itemSelected (property) {
    this.notificationService.loader.show();
    this.propertyViewService.setProperty(property);
    this.propertySearchService.setSearchResults(this.properties);
    this.notificationService.loader.hide();
    this.routerExtensions.navigate(['property'], {
      transition: {
          name: "fade"
      },
      queryParams: {
        "prevLocation": "/property-search"
      }
    });
  }
}