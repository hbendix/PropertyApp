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
    if (this.mapService.filterBody !== undefined) {
      this.filterForm = this.fb.group({
        priceMin: [this.mapService.filterBody.priceMin !== undefined ? <number>this.mapService.filterBody.priceMin : '', Validators.required],
        priceMax: [this.mapService.filterBody.priceMax !== undefined ? <number>this.mapService.filterBody.priceMax : '', Validators.required],
        bedMin: [this.mapService.filterBody.bedMax !== undefined ? <number>this.mapService.filterBody.bedMax : '', Validators.required],
        bedMax: [this.mapService.filterBody.bedMin !== undefined ? <number>this.mapService.filterBody.bedMin : '', Validators.required],
        bathMin: [this.mapService.filterBody.bathMin !== undefined ? <number>this.mapService.filterBody.bathMin : '', Validators.required],
        bathMax: [this.mapService.filterBody.bathMax !== undefined ? <number>this.mapService.filterBody.bathMax : '', Validators.required],
        roomMin: [this.mapService.filterBody.roomMin !== undefined ? <number>this.mapService.filterBody.roomMin : '', Validators.required],
        roomMax: [this.mapService.filterBody.roomMax !== undefined ? <number>this.mapService.filterBody.roomMax : '', Validators.required],
      });
    } else {
      this.filterForm = this.fb.group({
        priceMin: ['', Validators.required],
        priceMax: ['', Validators.required],
        bedMin: ['', Validators.required],
        bedMax: ['', Validators.required],
        bathMin: ['', Validators.required],
        bathMax: ['', Validators.required],
        roomMin: ['', Validators.required],
        roomMax: ['', Validators.required],
      });
    }
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
    this.filter = new FilterView();

    this.filter.tags = [];
    Object.keys(_filter).forEach(e => {
      if (_filter[e]) {
        this.filter[e] = _filter[e];
      }
    });
    console.log(this.filter);
    this.mapService.setFilterBody(this.filter);
    this.routerExtensions.navigate(['home'], {
      transition: {
          name: "fade"
      }
    });
  }
}

