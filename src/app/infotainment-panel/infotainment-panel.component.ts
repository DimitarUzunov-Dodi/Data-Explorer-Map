
import { Component, ViewChild} from '@angular/core';
import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel/hexagon-infotainment-panel.component';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  showInfotainmentPanel = false;
  searchedId = '';
  chooseInfPanel = "";
  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
}
