import { Component, OnInit, Input, ChangeDetectorRef, NgZone } from "@angular/core";
import { PropertyViewService } from "../../services/property-view.service";
import { PropertyView } from "../../models/property";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { registerElement } from 'nativescript-angular/element-registry';
import { ItemEventData } from "tns-core-modules/ui/list-view"
import { Area } from "~/app/models/area";
import { AreaService } from "~/app/services/area.service";
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { Image } from 'tns-core-modules/ui/image';
import { View } from 'tns-core-modules/ui/core/view';
import { AuthService } from "~/app/services/auth.service";
import { Mapbox, MapStyle, MapboxViewApi, Viewport as MapboxViewport, MapboxView } from "nativescript-mapbox";
import { environment } from "~/environments/environment";
import { NotificationService } from "~/app/services/notification.service";
import { ShortlistService } from "~/app/services/shortlist.service";
import { TNSTextToSpeech, SpeakOptions } from 'nativescript-texttospeech'
import * as dialogs from "tns-core-modules/ui/dialogs";
import { DatePipe } from "@angular/common";
@Component({
  selector: "ns-area-view",
  templateUrl: "./area-view.component.html",
  styleUrls: ["./area-view.component.css"],
  moduleId: module.id
})
export class AreaViewComponent implements OnInit {

  @Input()
  private long: number;
  private lat: number;
  private prevLocation: String;
  private ttsOptions: SpeakOptions;

  public area: Area;
  stats: any[];
  public isLoggedIn = this.auth.isLoggedIn();
  public isEditing = false;
  public accessToken: string; // MapBox Api key     
  private map: MapboxViewApi;

  public avgSpeeds = this.areaService.getInternetSpeeds();
  uploadIsGreater = false;
  downIsGreater = false;
  loaded = false;
  isViewingShortlist: boolean;
  editingComment: boolean;
  pipe = new DatePipe('en-UK'); // Use your own locale

  constructor(private areaService: AreaService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private auth: AuthService,
    private notificationService: NotificationService,
    private tts: TNSTextToSpeech,
    private shortlistService: ShortlistService,
    private changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone) {

    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.long = params.long;
      this.lat = params.lat;
      this.prevLocation = params.prevLocation;
    });

    if (this.prevLocation === '/shortlists') {
      this.isViewingShortlist = true;
    } 

    this.accessToken = environment.mapbox.accessToken;

  }
  
  ngOnInit() { 
    
    this._ngZone.run(() => {
      this.loadArea();
      setTimeout(()=>{
        this.notificationService.loader.hide();
        this.loaded = true;
      }, 100);
    });
  }

  onMapReady(args: any) {
    this.map = args.map;    
  }

  private loadArea () {
    this.area = <any>this.areaService.getArea();
    console.log(this.area);
    if (!this.area.notes) {
      this.area.notes = [];
    }
    this.area.postcode = this.area.postcode.split(" ")[0];
  }

  public getDownloadStat () {
    const nationalAvg = this.avgSpeeds.download;
    const areaAvg = this.area.broadband.avg_download;
    if (areaAvg > nationalAvg) {
      const i = areaAvg - nationalAvg;
      const p = (i / nationalAvg) * 100
      this.downIsGreater = true;

      return `${ Math.round(p * 100) / 100 }% more than the National Average`;
    } else if (areaAvg < nationalAvg) {
      const d = nationalAvg - areaAvg;
      const p = (d / nationalAvg) * 100;
      this.downIsGreater = false;

      return `${ Math.round(p * 100) / 100 }% less than the National Average`;
    }
  }

  public getUploadStat () {
    const nationalAvg = this.avgSpeeds.upload;
    const areaAvg = this.area.broadband.avg_upload;
    if (areaAvg > nationalAvg) {
      const i = areaAvg - nationalAvg;
      const p = (i / nationalAvg) * 100
      this.uploadIsGreater = true;

      return `${ Math.round(p * 100) / 100 }% more than the National Average`;
    } else if (areaAvg < nationalAvg) {
      const d = nationalAvg - areaAvg;
      const p = (d / nationalAvg) * 100;
      this.uploadIsGreater = false;

      return `${ Math.round(p * 100) / 100 }% less than the National Average`;
    }
  }

  onNavBtnTap (args: ItemEventData) {
    this.routerExtensions.navigate([this.prevLocation], {
      transition: {
          name: "fade"
      },
      queryParams: {
        "from": "/area",   
      }
    });
  }

  onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View) {
    // If the header content is still visible
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

  saveArea (area: Area) {
    if (this.isViewingShortlist) {
      dialogs.confirm({
        title: "Remove Area from Shortlist?",
        okButtonText: "Yes",
        cancelButtonText: "Cancel"
      }).then(r => {
        if (r) {
          this.shortlistService.deleteAreaFromShortlist(area._id)
            .subscribe(
              (res) => {
                this.notificationService.fireNotification('Removed from your shortlists!', true);
                this.routerExtensions.navigate(["shortlists"], {
                  transition: {
                      name: "fade"
                  }
                });
              }, (err) => {
                this.notificationService.fireNotification(`Error deleting Property ${ err.status } ${ err.statusText }`, false);
              }
            )
        }
      });
    } else {
      this.notificationService.loader.show();   
      area.lat = this.lat; 
      area.long = this.long; 
      this.shortlistService.addAreaToShortlist(area).subscribe(
        (res) => {
          this.notificationService.fireNotification('Added to your shortlists!', true);
          this.notificationService.loader.hide();
        }, (err) => {
          this.notificationService.fireNotification(`Error loading Area: ${ err.status } ${ err.statusText }`, false);
          this.notificationService.loader.hide();
        }
      )
    }
  }

  public addComment (comment: string) {
    console.log(comment);
 
    if (comment === '') {
      this.notificationService.fireNotification('Comments cannot  be empty!', false);
      return;
    }

    this.shortlistService.addAreaComment(this.area._id, comment)
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
    const note = <any>this.area.notes[index];

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
    const note = this.area.notes[index];
    const areaId = this.area._id;

    this.shortlistService.updateAreaComment(note, areaId, newComment).subscribe(
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
    const note = this.area.notes[index];
    const areaId = this.area._id;
    console.log(note, areaId);
    this.shortlistService.deleteAreaNote(note, areaId).subscribe(
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
    this.shortlistService.refreshAreaComments(this.area._id)
      .subscribe(
        (res) => {
          console.log(res); 
          this.area.notes = [];
          this.area.notes = <any>res;
          this.changeDetectorRef.markForCheck(); 
          this.changeDetectorRef.detectChanges(); 
        }, (err) => {
          this.notificationService.fireNotification(`Error refreshing comments ${ err.status } ${ err.statusText }`, false);
        }
      );
  }
  public sayComment (index) {
    const note = <any>this.area.notes[index];
    this.ttsOptions = {
      text: note.content,
      finishedCallback: (data) => {
        console.log(data);
      }
    }
    this.tts.speak(this.ttsOptions);
  }
  public sayInfo () {
    let theArea = "Area " + this.area.postcode ; 
    let price = " average price for this location is unavailable. "; 
    let sfbAvailability = " Access to super fast broadband is at " + this.area.broadband.super_fast + "%";
    let speeds = " With average download speeds of " + this.area.broadband.avg_download + " and average upload speeds of " + this.area.broadband.avg_upload + " . ";
    let gas = "estimated area gas consumption for the year stands at " + this.area.gas.consumption + ", across " + this.area.gas.meter_count + " meters. ";
    let electricity = "estimated area electricity consumption for the year stands at " + this.area.electricity.consumption + " across " + this.area.electricity.meter_count + " meters. ";
    if(this.area.electricity.consumption === undefined) {
      electricity = "No electricity information is available at this location. ";
    }
    if(this.area.gas.consumption === undefined) {
      gas = "No gas information is available at this location. ";
    }
    if(this.area.avgPrice >= 1) {
      price = " The average price paid in this location is £" + this.area.avgPrice + " .";
    }
    if(this.area.broadband.avg_download === undefined) {
      speeds = " average broadband speeds for this location are unavailable. "
    }
    this.ttsOptions = {
      text: theArea + price + sfbAvailability + speeds + gas + electricity,
      speakRate: 0.9,
      finishedCallback: (data) => {
        console.log(data);
      }
    }
    this.tts.speak(this.ttsOptions);
  }
}
