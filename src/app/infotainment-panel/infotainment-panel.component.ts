import { Component, ViewChild } from '@angular/core';
import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel/hexagon-infotainment-panel.component';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  @ViewChild(HexagonInfotainmentPanelComponent) infotainmentPanelComponent!: HexagonInfotainmentPanelComponent;
  showInfotainmentPanel = false;
  // chooseInfPanel = "hex";
  // chooseInfPanel = "user";
  chooseInfPanel = "poi";
  searchedHex: string = '';
  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
}
