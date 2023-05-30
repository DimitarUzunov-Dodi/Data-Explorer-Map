import { Component, Input } from '@angular/core';
import * as h3 from 'h3-js';

@Component({
  selector: 'app-hexagon-infotainment-panel',
  templateUrl: './hexagon-infotainment-panel.component.html',
  styleUrls: ['./hexagon-infotainment-panel.component.css']
})
export class HexagonInfotainmentPanelComponent {
  @Input() showInfotainmentPanel: boolean = false;
  @Input() searchedHex: string = '';

  hexagonInfotainmentPanel: HexagonInfotainmentPanelComponent | null = null;
  area: number = 0;

  ngOnChanges(): void {
    if (h3.isValidCell(this.searchedHex)) {
      this.hexagonInfotainmentPanel = this;
      this.area = h3.cellArea(this.searchedHex, 'km2');
    } else {
      this.hexagonInfotainmentPanel = null;
    }
  }
}