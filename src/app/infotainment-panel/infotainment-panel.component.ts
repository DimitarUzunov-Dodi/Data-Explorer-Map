
import { Component, Input, ViewChild} from '@angular/core';
import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel/hexagon-infotainment-panel.component';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  @ViewChild(HexagonInfotainmentPanelComponent) hexInfotainmentPanel!: HexagonInfotainmentPanelComponent;
  showInfotainmentPanel = false;
  searchedHex = '';
  chooseInfPanel = "";
  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
    this.hexInfotainmentPanel.poiPanel=false;
    this.hexInfotainmentPanel.showUserInfotainment=false;

  }
}
