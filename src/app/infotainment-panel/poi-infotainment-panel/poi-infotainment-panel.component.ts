import { Component, Input } from '@angular/core';
import { PoiService } from 'src/app/Services/poi.service';
import { PointOfInterest } from 'src/app/Services/models/poi';
import * as h3 from 'h3-js';


@Component({
  selector: 'app-poi-infotainment-panel',
  templateUrl: './poi-infotainment-panel.component.html',
  styleUrls: ['./poi-infotainment-panel.component.css']
})
export class PoiInfotainmentPanelComponent {
  @Input()
  showInfotainmentPanel: boolean = false;
  @Input() selectedHexId: string = '';


}
