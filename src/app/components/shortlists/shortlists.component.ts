import { Component, OnInit, Input } from "@angular/core";
import { UserService } from "~/app/services/user.service";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { ShortListItem } from "~/app/models/shortlistItem";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { Property } from "~/app/models/property";

@Component({
  selector: "ns-shortlists",
  templateUrl: "./shortlists.component.html",
  styleUrls: ["./shortlists.component.css"],
  moduleId: module.id
})
export class ShortlistsComponent implements OnInit {

  shortlists: ShortListItem[] = [];
  property: ShortListItem;

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions) {
      
  }
  
  ngOnInit() {
    this.shortlists = this.userService.getShortlists();
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

  public itemSelected (args: ItemEventData) {
    this.property = this.shortlists[args.index];
    console.log(this.property);
  }
  
}
