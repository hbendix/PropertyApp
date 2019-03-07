import { Component, OnInit, Input } from "@angular/core";
import { FilterViewService } from "../../services/filter-view.service";
import { FilterView } from "../../models/filter";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "ns-filter-view",
  templateUrl: "./filter-view.component.html",
  styleUrls: ["./filter-view.component.css"],
  moduleId: module.id
})
export class FilterViewComponent implements OnInit {

  @Input()
  public selectedIndex = 1;
  public items: Array<string>;

  constructor(private filterViewService: FilterViewService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions) {
    this.items = [];
    for (var i = 0; i < 5; i++) {
        this.items.push("data item " + i);
    }
  }

  ngOnInit() {
    
  }

  public onchange() {
    console.log(`Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`);
  }

  public onopen() {
    console.log("Drop Down opened.");
  }

  public onclose() {
    console.log("Drop Down closed.");
  }

  public onNavBtnTap() {
    this.routerExtensions.navigate(['home'], {
      transition: {
          name: "fade"
      }
    });
  }

  /*displayFilteredMap(): void {
    this.routerExtensions.navigate(["/home"], {
        transition: {
            name: "fade"
        },
        queryParams: {
            "Postcode": postcode"
        }
    });
  }*/
}

