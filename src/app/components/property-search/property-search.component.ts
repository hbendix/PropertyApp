import { Component, OnInit, Input } from "@angular/core";
import { PropertySearchViewService } from "../../services/property-search.service";
import { PropertySearchView } from "../../models/propertySearch";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "ns-propertySearch-view",
  templateUrl: "./property-search.component.html",
  styleUrls: ["./property-search.component.css"],
  moduleId: module.id
})
export class PropertySearchViewComponent implements OnInit {

  @Input()
  public selectedIndex = 1;
  public items: Array<string>;

  constructor(private PropertySearchViewService: PropertySearchViewService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions) {
    this.items = [];
    for (var i = 0; i < 5; i++) {
        this.items.push("data item " + i);
    }
  }

  ngOnInit() {
    
  }


  public onNavBtnTap() {
    this.routerExtensions.navigate(['home'], {
      transition: {
          name: "fade"
      }
    });
  }
}