import { Component, OnInit, Input } from "@angular/core";
import { FilterViewService } from "../../services/filter-view.service";
import { FilterView } from "~/app/models/filter";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { RouterExtensions } from "nativescript-angular/router";
import { MapViewService } from "../../services/map-view.service";
import { ActivatedRoute } from "@angular/router";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { DropDownData } from "../../models/filter"
import { NotificationService } from "~/app/services/notification.service";
@Component({
  selector: "ns-filter-view",
  templateUrl: "./filter-view.component.html",
  styleUrls: ["./filter-view.component.css"],
  moduleId: module.id
})
export class FilterViewComponent implements OnInit {

  filter: FilterView;
  filterForm: FormGroup = null;
  priceRange: number[];

  minPrice: number = null;
  maxPrice: number = null;

  minBed: number = null;
  maxBed: number = null;

  minBath: number = null;  
  maxBath: number = null;

  minRoom: number = null;
  maxRoom: number = null;

  constructor(private filterViewService: FilterViewService,
    private fb: FormBuilder,
    private mapService: MapViewService,
    private routerExtensions: RouterExtensions,
    private notificationService: NotificationService) {}

  ngOnInit() {
    if (this.mapService.filterBody !== undefined) {
      this.maxBath = this.mapService.filterBody.bathMax;
      this.minBath = this.mapService.filterBody.bathMin;
      this.maxBed = this.mapService.filterBody.bedMax;
      this.minBed = this.mapService.filterBody.bedMin;
      this.maxRoom = this.mapService.filterBody.roomMax;
      this.minRoom = this.mapService.filterBody.roomMin;
      this.maxPrice = this.mapService.filterBody.priceMax;
      this.minPrice = this.mapService.filterBody.priceMin;
    }
  }

  onNavBtnTap() {
    this.routerExtensions.navigate(['home'], {
      transition: {
          name: "fade"
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
          console.log(value, this.maxPrice, this.minPrice);
          console.log(this.minPrice > value);
          if (this.minPrice > value) {
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

  showTagsDialogue () {
    let options = {
      title: "Price range",
      cancelButtonText: "Cancel",
      actions: DropDownData.getPriceRange()
    };
    dialogs.action(options).then(r => {
      if (r !== 'Cancel') {

      }
    });
  }

  filterMap(): void  {
    this.filter = new FilterView();
    this.filter.tags = [];
    
    this.filter.bathMax = this.maxBath;
    this.filter.bathMin = this.minBath;
    this.filter.bedMax = this.maxBed;
    this.filter.bedMin = this.minBed;
    this.filter.roomMax = this.maxRoom;
    this.filter.roomMin = this.minRoom;
    this.filter.priceMax = this.maxPrice;
    this.filter.priceMin = this.minPrice;
    console.log(this.filter);

    this.mapService.setFilterBody(this.filter);
    this.routerExtensions.navigate(['home'], {
      transition: {
          name: "fade"
      }
    });
  }
}

