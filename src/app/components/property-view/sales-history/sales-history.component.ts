import { Component, OnInit, Input, ChangeDetectorRef, NgZone, ViewContainerRef } from "@angular/core";
import { PropertyViewService } from "~/app/services/property-view.service";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "~/app/services/notification.service";
import { RouterExtensions, registerElement, ModalDialogOptions, ModalDialogService } from "nativescript-angular";
import { SalesHistory } from "~/app/models/salesHistory";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { ChartDialogueComponent } from "./chart-dialogue/chart-dialogue.component";

@Component({
  selector: "ns-sales-history",
  templateUrl: "./sales-history.component.html",
  styleUrls: ["./sales-history.component.css"],
  moduleId: module.id
})
export class SalesHistoryComponent implements OnInit {
  prevLocation: any;
  saleHistory: SalesHistory[];
  categoricalSource: { Country: string, Amount: number, SecondVal: number, ThirdVal: number }[] = [
    { Country: "Germany", Amount: 15, SecondVal: 14, ThirdVal: 24 },
    { Country: "France", Amount: 13, SecondVal: 23, ThirdVal: 25 },
    { Country: "Bulgaria", Amount: 24, SecondVal: 17, ThirdVal: 23 },
    { Country: "Spain", Amount: 11, SecondVal: 19, ThirdVal: 24 },
    { Country: "USA", Amount: 18, SecondVal: 8, ThirdVal: 21 }
  ];


  constructor (private route: ActivatedRoute,
    private propertyService: PropertyViewService,
    private routerExtensions: RouterExtensions,
    private notificationService: NotificationService,
    private modalService: ModalDialogService,
    private vcRef: ViewContainerRef) {
    this.route.queryParams.subscribe(params => {
      this.prevLocation = params.prevLocation;
    });
  }  

  ngOnInit(): void {
    this.saleHistory = this.propertyService.getSalesHistory();
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

  showModal (item: SalesHistory) {
    console.log(item);
    const options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      context: item,
      fullscreen: false,
    };

    this.modalService.showModal(ChartDialogueComponent, options)
      .then((result: string) => {
          console.log(result);
      }
    );
  }
}
