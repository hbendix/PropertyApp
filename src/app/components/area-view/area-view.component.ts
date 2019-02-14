import { Component, OnInit, Input } from "@angular/core";
import { PropertyViewService } from "../../services/property-view.service";
import { PropertyView } from "../../models/property";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { registerElement } from 'nativescript-angular/element-registry';
import { ItemEventData } from "tns-core-modules/ui/list-view"
import { Area } from "~/app/models/area";
import { AreaService } from "~/app/services/area.service";

@Component({
  selector: "ns-area-view",
  templateUrl: "./area-view.component.html",
  styleUrls: ["./area-view.component.css"],
  moduleId: module.id
})
export class AreaViewComponent implements OnInit {

  @Input()
  private long: Number;
  private lat: Number;
  private prevLocation: String;

  public area: Area;
  stats: any[];

  constructor(private areaService: AreaService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions) {
    this.route.queryParams.subscribe(params => {
      this.long = params.long;
      this.lat = params.lat;
      this.prevLocation = params.prevLocation;
    });
  }
  
  ngOnInit() {
    this.loadArea();
  }

  

  private loadArea () {
    this.area = this.areaService.getArea();
  }

  private sortStats () {
    
  }

  onNavBtnTap (args: ItemEventData) {
    this.routerExtensions.navigate(['/home'], {
      transition: {
          name: "fade"
      }
    });
  }
}
