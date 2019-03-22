import { Component, OnInit, Input } from "@angular/core";
import { PropertySearchViewService } from "../../services/property-search.service";
import { PropertySearchView } from "../../models/propertySearch";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "~/app/services/notification.service";
import { ShortListItem } from "~/app/models/shortlistItem";
import { FilterView } from "~/app/models/filter";

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

  constructor(private searchViewService: PropertySearchViewService,
    private fb: FormBuilder,
    private routerExtensions: RouterExtensions,
    private notificationService: NotificationService) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      postcode: ['', Validators.required],
      minPrice: [''],
      maxPrice: [''],
      houseType: [''],
      bedCount: ['']
  });
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
      this.isValid = false;
      return;
    }
    this.search = new FilterView();
    let params = '';
    Object.keys(_search).forEach((e, i) => {
      if (_search[e]) {
        if (e === 'postcode') {
          params = _search[e].replace(/\s/g, '');
        } else {
          this.search[e] = _search[e];
        }
      }
    });

    console.log(this.search);

    
    this.searchViewService.getSearch(params, this.search)
    .subscribe((res) => {
      console.log(res);
      this.properties = <ShortListItem[]>res;
      this.loading = false;
      this.viewingList = true;
      }, (err) => {
        this.notificationService.fireNotification(`Error getting Properties: ${ err.status } ${ err.statusText }`, false);
      }
    );
  }
}