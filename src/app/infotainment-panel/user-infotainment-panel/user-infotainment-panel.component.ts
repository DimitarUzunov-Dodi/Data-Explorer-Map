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
  @Input() userId: string = '';
  pois: PointOfInterest[] = []

  constructor(private poiService: PoiService,private homepage: HomepageComponent) {}

  ngOnInit(){
    this.pois = this.poiService.getUserPOIs(this.userId)
  }

  openPoiInfotainment(poiId: string) {
    this.homepage.handleSearchTriggered(["poi", poiId], true)
  }


}
