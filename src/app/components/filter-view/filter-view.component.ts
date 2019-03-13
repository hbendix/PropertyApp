import { Component, OnInit, Input } from "@angular/core";
import { FilterViewService } from "../../services/filter-view.service";
import { FilterView } from "~/app/models/filter";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { RouterExtensions } from "nativescript-angular/router";
import { MapViewService } from "../../services/map-view.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "ns-filter-view",
  templateUrl: "./filter-view.component.html",
  styleUrls: ["./filter-view.component.css"],
  moduleId: module.id
})
export class FilterViewComponent implements OnInit {

  filter: FilterView;
  filterForm: FormGroup = null;

  constructor(private filterViewService: FilterViewService,
    private fb: FormBuilder,
    private mapService: MapViewService,
    private routerExtensions: RouterExtensions) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      minPrice: ['', Validators.required],
      maxPrice: ['', Validators.required],
      minBed: ['', Validators.required],
      maxBed: ['', Validators.required],
      minBath: ['', Validators.required],
      maxBath: ['', Validators.required],
      minRoom: ['', Validators.required],
      maxRoom: ['', Validators.required],
      tags: ['', Validators.required],
  });
  }

  onNavBtnTap() {
    this.routerExtensions.navigate(['home'], {
      transition: {
          name: "fade"
      }
    });
  }

  filterMap(): void  {
    let _filter = this.filterForm.value;
    this.filter = new FilterView(Number(_filter.minPrice), Number(_filter.maxPrice), Number(_filter.minBed),
     Number(_filter.maxBed), Number(_filter.minBath), Number(_filter.maxBath), Number(_filter.minRoom), 
     Number(_filter.maxRoom), Array<string>(_filter.tags));
    this.mapService.setFilterBody(this.filter);
    this.routerExtensions.navigate(['home'], {
      transition: {
          name: "fade"
      }
    });
  }
}

