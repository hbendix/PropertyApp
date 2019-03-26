import { Component, OnInit, Input, ChangeDetectorRef, NgZone } from "@angular/core";
import { PropertyViewService } from "~/app/services/property-view.service";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "~/app/services/notification.service";
import { RouterExtensions, registerElement } from "nativescript-angular";
import { SalesHistory } from "~/app/models/salesHistory";

@Component({
  selector: "ns-sales-history",
  templateUrl: "./sales-history.component.html",
  styleUrls: ["./sales-history.component.css"],
  moduleId: module.id
})
export class SalesHistoryComponent implements OnInit {
  prevLocation: any;
  saleHistory: SalesHistory[];


  constructor (private route: ActivatedRoute,
    private propertyService: PropertyViewService,
    private routerExtensions: RouterExtensions,
    private notificationService: NotificationService) {
    this.route.queryParams.subscribe(params => {
      this.prevLocation = params.prevLocation;
    });
  }  

  ngOnInit(): void {
    this.saleHistory = this.propertyService.getSalesHistory();
    console.log(this.saleHistory);
    this.notificationService.loader.hide();
  }

  public onNavBtnTap(){
    this.notificationService.loader.show();
    this.routerExtensions.navigate([this.prevLocation], {
      transition: {
          name: "fade"
      },
      queryParams: {
        "from": "/sale-history",   
      }
    });
  }

  trackByDate(index: number, history: any): number {
    return history.date;
  }
}
