import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hexagon-infotainment-panel',
  templateUrl: './hexagon-infotainment-panel.component.html',
  styleUrls: ['./hexagon-infotainment-panel.component.css']
})
export class HexagonInfotainmentPanelComponent {
  @Input()
  showInfotainmentPanel: boolean = false;
  area = 0;
}
