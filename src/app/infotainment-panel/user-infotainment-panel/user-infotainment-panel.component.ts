import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {PoiService} from "../../Services/poi.service";
import {HttpClient} from "@angular/common/http";
import {HomepageComponent} from "../../homepage/homepage.component";
import {PointOfInterest} from "../../Services/models/poi";


@Component({
  selector: 'app-user-infotainment-panel',
  templateUrl: './user-infotainment-panel.component.html',
  styleUrls: ['./user-infotainment-panel.component.css']
})
export class UserInfotainmentPanelComponent implements OnInit {
  @Input()
  showInfotainmentPanel = false;
  @Input() userId = '';
  pois: PointOfInterest[] = []

  constructor(private poiService: PoiService,private homepage: HomepageComponent) {}

   /**
   * Lifecycle hook that is called after the component has been initialized.
   * Used to fetch necessary data and perform initialization tasks, such as
   * getting the Points of Interested related to the user.
   */
   ngOnInit() {
    this.pois = this.poiService.getUserPOIs(this.userId);
  }
  /**
  Opens the POI infotainment for the specified POI ID.
  @param poiId - The ID of the POI to open the infotainment for.
  @returns void
  */
  openPoiInfotainment(poiId: string) {
    this.homepage.enqueue(["poi", poiId], this.homepage.past);
    this.homepage.handleSearchTriggered(["poi", poiId])
  }
}
