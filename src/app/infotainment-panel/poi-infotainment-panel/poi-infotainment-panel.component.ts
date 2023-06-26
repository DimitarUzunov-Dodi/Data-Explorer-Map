import { Component, Input } from '@angular/core';
import { PointOfInterest } from 'src/app/Services/models/poi';
import { PoiService } from 'src/app/Services/poi.service';
import { HomepageComponent } from 'src/app/homepage/homepage.component';

@Component({
  selector: 'app-poi-infotainment-panel',
  templateUrl: './poi-infotainment-panel.component.html',
  styleUrls: ['./poi-infotainment-panel.component.css']
})
export class PoiInfotainmentPanelComponent {
  @Input() showInfotainmentPanel = false;
  @Input() selectedPoiId = '';
  poi: PointOfInterest | null = null;
  expDate = new Date();
  stat = '';
  hexIdMaxRes = '';

  constructor(private poiService: PoiService, private homepage: HomepageComponent) {}

  /**
   * Lifecycle hook that is called after the component has been initialized.
   * Used to fetch necessary data and perform initialization tasks such as
   * getting the poi that will be displayed, setting the expDate, status
   * and highest resolution hexagon with this poi.
   */
  ngOnInit() {
    this.poi = this.poiService.getPoiArr().find((poi) => poi.id === this.selectedPoiId) ?? null;
    if (this.poi) {
      this.expDate = this.poiService.getExpDate(this.poi);
    }
    this.getStatus();
    this.getHexagons();
  }

  /**
   * Retrieves the highest resolution hexagon with the selected Point of Interest.
   */
  getHexagons(): void {
    const v = this.poiService.getHexagonsByPoiId(this.selectedPoiId).sort((a, b) => b.resolution - a.resolution);
    if (v[0]) {
      this.hexIdMaxRes = v[0].hexId;
    }
  }

  /**
   * Opens the hexagon infotainment panel for the specified hexagon ID.
   * @param hexId The ID of the hexagon to open.
   */
  openHexInfotainment(hexId: string): void {
    this.homepage.enqueue(["hex", hexId], this.homepage.past);
    this.homepage.handleSearchTriggered(["hex", hexId]);
  }

  /**
   * Opens the user infotainment panel for the specified user ID.
   * @param userId The ID of the user to open.
   */
  openUserInfotainment(userId: string): void {
    this.homepage.enqueue(["user", userId], this.homepage.past);
    this.homepage.handleSearchTriggered(["user", userId]);
  }

  /**
   * Retrieves the status of the Point of Interest based on its expiration date.
   */
  getStatus(): void {
    const currTime = new Date();
    if (this.expDate < currTime) {
      this.stat = "Expired";
    } else {
      this.stat = "Active";
    }
  }
}
