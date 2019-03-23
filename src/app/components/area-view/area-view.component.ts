import { Component, OnInit, Input } from "@angular/core";
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

  constructor(private areaService: AreaService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private auth: AuthService,
    private notificationService: NotificationService,
    private shortlistService: ShortlistService) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.long = params.long;
      this.lat = params.lat;
      this.prevLocation = params.prevLocation;
    });
    this.accessToken = environment.mapbox.accessToken;

  }
  
  ngOnInit() { 
    this.loadArea();
    this.notificationService.loader.hide();
    setTimeout(()=>{
      console.log(this.long);
      console.log(this.lat);
      this.loaded = true;
    }, 100)
  }

  onMapReady(args: any) {
    this.map = args.map;    
  }

  private loadArea () {
    this.area = <any>this.areaService.getArea();
    console.log(this.area);
    // this.area.postcode = this.area.postcode.split(" ")[0];
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
    this.routerExtensions.navigate(['/home'], {
      transition: {
          name: "fade"
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
    this.notificationService.loader.show();    
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
