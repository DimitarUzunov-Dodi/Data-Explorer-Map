import { Component, ViewChild } from '@angular/core';
import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel/hexagon-infotainment-panel.component';
import { PoiInfotainmentPanelComponent } from './poi-infotainment-panel/poi-infotainment-panel.component';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  @ViewChild(HexagonInfotainmentPanelComponent) currentPanel!: HexagonInfotainmentPanelComponent;
  @ViewChild(PoiInfotainmentPanelComponent) poiPan!: PoiInfotainmentPanelComponent;
  showInfotainmentPanel = false;
  searchedHex: string = '';
  // chooseInfPanel = "hex";
  // chooseInfPanel = "user";
  chooseInfPanel = "";

  ngOnIt(): void{
    this.poiPan.selectedHexId = this.currentPanel.searchedHex
  }
  
  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
}
