import { Component, Input, ViewChild } from '@angular/core';
import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel/hexagon-infotainment-panel.component';
import { PoiInfotainmentPanelComponent } from './poi-infotainment-panel/poi-infotainment-panel.component';
import { PointOfInterest } from '../Services/models/poi';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  showInfotainmentPanel = false;
  searchedHex: string = '';
  chooseInfPanel = "";
  
  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
}
