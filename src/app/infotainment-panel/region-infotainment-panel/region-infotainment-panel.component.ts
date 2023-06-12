import { Component, Input } from '@angular/core';
import { HomepageComponent } from 'src/app/homepage/homepage.component';
@Component({
  selector: 'app-region-infotainment-panel',
  templateUrl: './region-infotainment-panel.component.html',
  styleUrls: ['./region-infotainment-panel.component.css']
})
export class RegionInfotainmentPanelComponent {
  @Input() showInfotainmentPanel = false;
  @Input() selectedRegionId = '';
  selectedHexagons: Set<string> = new Set<string>;
  constructor(private homepageComponent: HomepageComponent){
    this.selectedHexagons = homepageComponent.mapComponent.searchHexIds;
  }
  
}
