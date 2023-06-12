import { Component, Input } from '@angular/core';
import { MapComponent } from 'src/app/map/map.component';
@Component({
  selector: 'app-region-infotainment-panel',
  templateUrl: './region-infotainment-panel.component.html',
  styleUrls: ['./region-infotainment-panel.component.css']
})
export class RegionInfotainmentPanelComponent {
  @Input() showInfotainmentPanel = false;
  @Input() selectedRegionId = '';
  selectedHexagons = this.mapComponent.searchHexIds;
  constructor(private mapComponent: MapComponent){}
  
}
