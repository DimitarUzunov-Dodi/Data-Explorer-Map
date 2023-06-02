import { Component, Input, ViewChild } from '@angular/core';
import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel/hexagon-infotainment-panel.component';
import { PoiInfotainmentPanelComponent } from './poi-infotainment-panel/poi-infotainment-panel.component';
import { PointOfInterest } from '../Services/models/poi';
import { PieChartComponent} from "../pie-chart/pie-chart.component";

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  @ViewChild(HexagonInfotainmentPanelComponent) currentPanel!: HexagonInfotainmentPanelComponent;
  @ViewChild(PoiInfotainmentPanelComponent) poiPan!: PoiInfotainmentPanelComponent;
  @ViewChild(PieChartComponent) pieChart!: PieChartComponent;
  @Input() poiPerHexPerResolution: Map<number, Map<string, PointOfInterest[]>> = new Map<number, Map<string, PointOfInterest[]>>();
  showInfotainmentPanel = false;
  searchedHex: string = '';
  // chooseInfPanel = "hex";
  // chooseInfPanel = "user";
  chooseInfPanel = "";

  ngOnIt(): void{
    this.poiPan.selectedHexId = this.currentPanel.searchedHex
    this.poiPan.poiPerHexPerResolution = this.poiPerHexPerResolution
  }

  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
}
