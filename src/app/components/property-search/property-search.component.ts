import { Component, OnInit, Input } from "@angular/core";
import { PropertySearchViewService } from "../../services/property-search.service";
import { PropertySearchView } from "../../models/propertySearch";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "ns-propertySearch-view",
  templateUrl: "./property-search.component.html",
  styleUrls: ["./property-search.component.css"],
  moduleId: module.id
})
export class PropertySearchViewComponent implements OnInit {

  search: PropertySearchView;
  searchForm: FormGroup = null;

  constructor(private searchViewService: PropertySearchViewService,
    private fb: FormBuilder,
    private routerExtensions: RouterExtensions) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      postcode: ['', Validators.required],
      minPrice: ['', Validators.required],
      maxPrice: ['', Validators.required],
      houseType: ['', Validators.required],
      bedCount: ['', Validators.required]
  });
  }

  onNavBtnTap() {
    this.routerExtensions.navigate(['home'], {
      transition: {
          name: "fade"
      }
    });
  }

  searchProperties(): void  {
    let _search = this.searchForm.value;
    this.search = new PropertySearchView(_search.postcode, _search.minPrice, _search.maxPrice, _search.houseType, _search.bedCount);
    this.routerExtensions.navigate(['home'], {
      transition: {
          name: "fade"
      }
    });
  }
}