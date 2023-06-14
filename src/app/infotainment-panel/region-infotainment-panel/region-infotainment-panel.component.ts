import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HomepageComponent } from 'src/app/homepage/homepage.component';
@Component({
  selector: 'app-region-infotainment-panel',
  templateUrl: './region-infotainment-panel.component.html',
  styleUrls: ['./region-infotainment-panel.component.css']
})
export class RegionInfotainmentPanelComponent{
  @Input() showInfotainmentPanel = false;
  @Input() selectedRegionId = '';
  @Input() selectedHexagons: Set<string> = new Set<string>;
  constructor(private homepage: HomepageComponent) {}
  openHexInfotainment(hexId: string){
    this.homepage.enqueue(["hex", hexId], this.homepage.past);
    this.homepage.handleSearchTriggered(["hex", hexId])
  }
}
