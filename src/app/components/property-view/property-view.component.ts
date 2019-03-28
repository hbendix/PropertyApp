import { Component, OnInit, Input, OnDestroy, AfterViewInit } from "@angular/core";
import { PropertyViewService } from "../../services/property-view.service";
import { PropertyView } from "../../models/property";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { registerElement } from 'nativescript-angular/element-registry';
import { ItemEventData } from "tns-core-modules/ui/list-view"
import { NotificationService } from "~/app/services/notification.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { ShortlistService } from "~/app/services/shortlist.service";
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { Image } from 'tns-core-modules/ui/image';
import { View } from 'tns-core-modules/ui/core/view';
import { AuthService } from "~/app/services/auth.service";
import { DatePipe } from "@angular/common";

import { TNSTextToSpeech, SpeakOptions } from 'nativescript-texttospeech'

import * as Utils from 'utils/utils'
import { AreaService } from "~/app/services/area.service";

registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
  selector: "ns-property-view",
  templateUrl: "./property-view.component.html",
  styleUrls: ["./property-view.component.css"],
  moduleId: module.id
})
export class PropertyViewComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  private long: Number;
  private lat: Number;

  private prevLocation: string;
  private ttsOptions: SpeakOptions;

  public property: PropertyView;
  public isBusy = true;
  public stats = [];
  public isList = true;
  public propertyList = [];
  public isLoggedIn = this.auth.isLoggedIn();
  public isEditing = false;

  pipe = new DatePipe('en-UK'); // Use your own locale
  isViewingShortlist = false;
  editingComment: boolean;
  isViewingSearchItem = false;
  wasViewingArea = false;

  constructor(private propertyViewService: PropertyViewService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private notificationService: NotificationService,
    private shortlistService: ShortlistService,
    private tts: TNSTextToSpeech,
    private auth: AuthService,
    private areaService: AreaService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.long = params.long;
      this.lat = params.lat;
      this.prevLocation = params.prevLocation;

      if (params.from === '/area' || params.from === '/sale-history') {
        this.wasViewingArea = true;
      }
    });

    console.log(this.prevLocation);

    if (this.prevLocation === '/shortlists') {
      this.isViewingShortlist = true;
    } else if (this.prevLocation === '/property-search') {
      this.isViewingSearchItem = true;
    }

    this.loadProperty();
  }
  
  ngAfterViewInit () {
    this.notificationService.loader.hide();
  }

  public onNavBtnTap(){
    this.notificationService.loader.show();
    if ((this.isList) || (this.propertyList.length == 0)) {
      this.propertyViewService.isViewingShortList = false;    
      this.routerExtensions.navigate([this.prevLocation], {
        transition: {
            name: "fade"
        }
      });
    } else {
      this.isList = true;
      this.notificationService.loader.hide();
    }
  }

  private loadProperty () {
    if (this.propertyViewService.isViewingShortList || this.isViewingSearchItem || this.wasViewingArea) {
      this.property = this.propertyViewService.toView;
      this.sortStats();
      this.isList = false;
      this.long = <number><unknown>this.property.long;
      this.lat = <number><unknown>this.property.lat;
      if (this.wasViewingArea) {
        this.prevLocation = this.property.prevLocation;
        this.long = <number><unknown>this.property.long;
        this.lat = <number><unknown>this.property.lat;
      }
    } else {
      this.propertyViewService.getPropertyModel(this.long, this.lat)
        .subscribe((res) => {
          if (res[1]) {
            this.propertyList = <any>res;
            this.isList = true;
          } else {
            this.property = <any>res[0];
            this.sortStats();
            this.isList = false;
          }
        }, (err) => {
          this.notificationService.fireNotification(`Error getting property: ${ err.status } - ${ err.statusText }`, false); 
          console.log(err);
        }
      );
    }
  }

  private sortStats () {
    this.stats = [];
    if (this.property.bedroomNumber) {
      this.stats.push({
        "name": "Bedrooms",
        "value": this.property.bedroomNumber,
        "icon": "&#xf236;"
      })
    }
    if (this.property.parkingSpaces) {
      this.stats.push({
        "name": "Parking Spaces",
        "value": this.property.parkingSpaces,
        "icon": "&#xf236;"
      })
    }
    if (this.property.bathroomNumber) {
      this.stats.push({
        "name": "Bathrooms",
        "value": this.property.bathroomNumber,
        "icon": "&#xf236;"
      })
    }
  }

  public goToLink () {
    Utils.openUrl(this.property.lister_url);
  }

  public onItemTap (index) {
    this.notificationService.loader.show();
    this.property = this.propertyList[index];

    
    console.log(index, this.property);
    this.sortStats();
    this.isList = false;
    this.notificationService.loader.hide();
  }

  public saveProperty (property: PropertyView) {

    if (this.isViewingShortlist) {
      dialogs.confirm({
        title: "Remove Property from Shortlist?",
        okButtonText: "Yes",
        cancelButtonText: "Cancel"
      }).then(r => {
        if (r) {
          this.shortlistService.deletePropertyFromShortlist(this.property._id)
            .subscribe(
              (res) => {
                this.notificationService.fireNotification('Removed from your shortlists!', true);
                this.routerExtensions.navigate([this.prevLocation], {
                  transition: {
                      name: "fade"
                  }
                });
              }, (err) => {
                this.notificationService.fireNotification(`Error deleting Property ${ err.status } ${ err.statusText }`, false);
              }
            );
        }
      });
    } else {
      dialogs.prompt({
          title: "Add a name to Property?",
          okButtonText: "Save",
          neutralButtonText: "Skip",
          cancelButtonText: "Cancel",
          inputType: dialogs.inputType.text
        }).then(r => {
          console.log(r.result);
          if (r.result) {
            property.propertyName = r.text;
          } else if (!r.result && r.result !== undefined) {
            return;
          }
          this.notificationService.loader.show();        
          this.shortlistService.addPropertyToShortList(property)
            .subscribe(
              (res) => {
                this.notificationService.fireNotification('Added to your shortlists!', true);
                this.notificationService.loader.hide();        
              }, (err) => {
                this.notificationService.fireNotification(`Error adding to your shortlist ${ err.status } ${ err.statusText }`, false);
                this.notificationService.loader.hide();        
              }
            );
        });
    }

  }

  public addComment (comment: string) {
    console.log(comment);

    if (comment === '') {
      this.notificationService.fireNotification('Comments cannot  be empty!', false);
      return;
    }

    this.shortlistService.addComment(this.property._id, comment)
      .subscribe(
        (res) => {
          this.notificationService.fireNotification('Comment added. 📝', true);
          this.isEditing = false;
          this.refreshComments();
      }, (err) => {
            this.notificationService.fireNotification(`Error adding a comment ${ err.status } ${ err.statusText }`, false);
            console.log(err);
        }
      )
  }

  public getDatesForComment (index) {
    const note = <any>this.property.notes[index];

    const cD = this.pipe.transform(note.created, 'dd/MM/yy HH:mm');
    const eD = this.pipe.transform(note.updated, 'dd/MM/yy HH:mm');
    if (cD === eD) {
      return cD;
    } else {
      return `${ cD } - edited ${ eD }`
    }
  }

  public updateComment (index, newComment) {
    console.log(index, newComment);
    const note = this.property.notes[index];
    const propertyId = this.property._id;

    this.shortlistService.updateComment(note, propertyId, newComment).subscribe(
      (res) => {
        this.notificationService.fireNotification('Comment updated. 📝', true);
        this.editingComment = false;
        this.refreshComments();
      }, (err) => {
        this.notificationService.fireNotification(`Error updating comment ${ err.status } ${ err.statusText }`, false);
        console.log(err);
      }
    )
  }

  public deleteComment (index) {
    const note = this.property.notes[index];
    const propertyId = this.property._id;
    console.log(note, propertyId);
    this.shortlistService.deleteNote(note, propertyId).subscribe(
      (res) => {
        this.notificationService.fireNotification('Comment deleted. 📝', true);
        this.editingComment = false;
        this.refreshComments();
      }, (err) => {
        this.notificationService.fireNotification(`Error deleting comment ${ err.status } ${ err.statusText }`, false);
        console.log(err);
      }
    )
  }

  private refreshComments () {
    this.shortlistService.refreshComments(this.property._id)
      .subscribe(
        (res) => {
          console.log(res); 
          this.property.notes = <any>res;
          console.log(this.property);
          console.log(this.property.notes);
        }, (err) => {
          this.notificationService.fireNotification(`Error refreshing comments ${ err.status } ${ err.statusText }`, false);
        }
      );
  }

  public sayComment (index) {
    const note = <any>this.property.notes[index];
    this.ttsOptions = {
      text: note.content,
      finishedCallback: (data) => {
        console.log(data);
      }
    }
    this.tts.speak(this.ttsOptions);
  }

  public sayInfo () {
    let theProperty = "Property listing " + this.property.fullAddress + ". "; 
    let price = "The price for this property is " + this.property.price;
    let bedroom = " It contains" + this.property.bedroomNumber + "bedrooms, "
    let bathroom = "number of bathrooms is not stated. ";
    let parking = "number of parking spaces is not stated. ";
    if(this.property.bathroomNumber >= 1) {
      bathroom = this.property.bathroomNumber + "bathrooms"
    }
    if(this.property.parkingSpaces >= 1) {
      bathroom = this.property.parkingSpaces + "parking spaces"
    }
    this.ttsOptions = {
      text: theProperty + price + bedroom + bathroom + "and" + parking,
      speakRate: 0.9,
      finishedCallback: (data) => {
        console.log(data);
      }
    }
    this.tts.speak(this.ttsOptions);
  }

  onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View) {
    // If the header content is still visiible
    // console.log(scrollView.verticalOffset);
    if (scrollView.verticalOffset < 250) {
        const offset = scrollView.verticalOffset / 2;
        if (scrollView.ios) {
            // iOS adjust the position with an animation to create a smother scrolling effect. 
            topView.animate({ translate: { x: 0, y: offset } }).then(() => { }, () => { });
        } else {
            // Android, animations are jerky so instead just adjust the position without animation.
            topView.translateY = Math.floor(offset);
        }
    }
  }

  viewAreaStats () {
      this.notificationService.loader.show();
      this.areaService.pullArea(<number><unknown>this.property.lat, <number><unknown>this.property.long).subscribe(
      (res) => {
        this.areaService.area = res;
        this.property.prevLocation = this.prevLocation;
        this.propertyViewService.setProperty(this.property);
        this.routerExtensions.navigate(["/area"], {
          transition: {
              name: "fade"
          },
          queryParams: {
              "prevLocation": "/property",        
              "long": this.property.long,
              "lat": this.property.lat
          }
      });
      }, (err) => {
        if (err.status === 404) {
          this.notificationService.fireNotification(`No area statistics!`, false);
        } else {
          this.notificationService.fireNotification(`Error loading area ${ err.status } ${ err.statusText }`, false);
        }
        this.notificationService.loader.hide();
      }
    )
  }

  showSalesHistory () {
    this.notificationService.loader.show();

    this.propertyViewService.pullSalesHistory(this.lat.toString(), this.long.toString()).subscribe(
      (res) => {
        this.propertyViewService.setSalesHistory(res);
        this.property.prevLocation = this.prevLocation;
        this.property.long = this.long.toString();
        this.property.lat = this.lat.toString();
        this.propertyViewService.setProperty(this.property);
        this.routerExtensions.navigate(["/sale-history"], {
          transition: {
              name: "fade"
          },
          queryParams: {
              "prevLocation": "/property"
          }
      });
      }, (err) => {
        this.notificationService.fireNotification(`Error loading area ${ err.status } ${ err.statusText }`, false);
        this.notificationService.loader.hide();
      }
    )
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.propertyViewService.isViewingShortList = false;
    console.log(this.propertyViewService.isViewingShortList);
  }
}
