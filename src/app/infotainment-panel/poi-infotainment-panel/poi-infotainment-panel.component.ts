import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-poi-infotainment-panel',
  templateUrl: './poi-infotainment-panel.component.html',
  styleUrls: ['./poi-infotainment-panel.component.css']
})
export class PoiInfotainmentPanelComponent {
  @Input()
  showInfotainmentPanel = false;
}
