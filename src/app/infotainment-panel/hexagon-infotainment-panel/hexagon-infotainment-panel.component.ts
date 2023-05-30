import { Component, Input } from '@angular/core';
import * as h3 from "h3-js";

@Component({
  selector: 'app-hexagon-infotainment-panel',
  templateUrl: './hexagon-infotainment-panel.component.html',
  styleUrls: ['./hexagon-infotainment-panel.component.css']
})
export class HexagonInfotainmentPanelComponent {
  @Input()
  showInfotainmentPanel: boolean = false;
  @Input() searchedHex: string = '';
  area = h3.cellArea(this.searchedHex, "km2");
}
