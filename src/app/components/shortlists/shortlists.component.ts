import { Component, OnInit, Input } from "@angular/core";
import { UserService } from "~/app/services/user.service";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { ShortListItem, AreaShortListItem } from "~/app/models/shortlistItem";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { Property } from "~/app/models/property";
import { PropertyViewService } from "~/app/services/property-view.service";
import { NotificationService } from "~/app/services/notification.service";
import { ShortlistService } from "~/app/services/shortlist.service";
import { registerElement } from 'nativescript-angular/element-registry';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { CardView } from 'nativescript-cardview';
registerElement('CardView', () => CardView);
@Component({
  selector: "ns-shortlists",
  templateUrl: "./shortlists.component.html",
  styleUrls: ["./shortlists.component.css"],
  moduleId: module.id
})
export class ShortlistsComponent implements OnInit {

  shortlists: ShortListItem[] = [];
  property: ShortListItem;
  areas: AreaShortListItem[] = [];

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private propertyService: PropertyViewService,
    private notificationService: NotificationService,
    private shortlistService: ShortlistService) {
      
  }
  
  ngOnInit() {
    this.notificationService.loader.show();    
    this.getShortlist();
  }

  private getShortlist(): any {
    this.shortlistService.getShortlist()
      .subscribe(
        (res) => {
          this.notificationService.loader.hide();    
          this.shortlists =  res;
        }, (err) => {
          this.notificationService.fireNotification(`Error loading your shortlist: ${ err.status } ${ err.statusText }`, false);
          this.notificationService.loader.hide();    
        }
      );
    
      this.shortlistService.getAreaShortlist().subscribe(
        (res) => {
          console.log(res);
          this.areas = <any>res;
          this.notificationService.loader.hide();    
        }, (err) => {
          this.notificationService.fireNotification(`Error loading your shortlist: ${ err.status } ${ err.statusText }`, false);
          this.notificationService.loader.hide();    
        }
      );
  }

  /**
   * onNavBtnTap
   */
  public onNavBtnTap() {
    this.routerExtensions.navigate(['home'], {
      transition: {
          name: "fade"
      }
    });
  }

  public deleteShortlist (propertyId) {
    dialogs.confirm({
      title: "Remove Property from Shortlist?",
      okButtonText: "Yes",
      cancelButtonText: "Cancel"
    }).then(r => {
      if (r) {
        this.shortlistService.deletePropertyFromShortlist(propertyId)
          .subscribe(
            (res) => {
              this.notificationService.fireNotification('Deleted property', true); 
              this.getShortlist();         
            }, (err) => {
              this.notificationService.fireNotification(`Error deleting property: ${ err.status } ${ err.statusText }`, false);          
            }
          )
      }
    });
  }

  public itemSelected (propertyId) {
    this.propertyService.viewProperty(propertyId)
      .subscribe(
        (res) => {
          console.log(res);
          this.propertyService.toView = <any>res;
          this.propertyService.isViewingShortList = true;

          this.routerExtensions.navigate(['property'], {
            transition: {
                name: "fade"
            },
            queryParams: {
              "prevLocation": "/shortlists"
            }
          });
        }, (err) => {
          this.notificationService.fireNotification(`Error loading property: ${ err.status } ${ err.statusText }`, false);
        }
      );
  }

  public deleteArea (areaId) {
    dialogs.confirm({
      title: "Remove Area from Shortlist?",
      okButtonText: "Yes",
      cancelButtonText: "Cancel"
    }).then(r => {
      if (r) {
        
      }
    });
  }

  public areaSelected (areaId) {

  }
  
}
