
import { Component, Input, ViewChild } from '@angular/core';
import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel/hexagon-infotainment-panel.component';
import { PoiInfotainmentPanelComponent } from './poi-infotainment-panel/poi-infotainment-panel.component';
import { PointOfInterest } from '../Services/models/poi';
import { PieChartComponent} from "../pie-chart/pie-chart.component";
import { UserInfotainmentPanelComponent } from './user-infotainment-panel/user-infotainment-panel.component';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  showInfotainmentPanel = false;
  searchedHex = '';
  chooseInfPanel = "";
  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
}
