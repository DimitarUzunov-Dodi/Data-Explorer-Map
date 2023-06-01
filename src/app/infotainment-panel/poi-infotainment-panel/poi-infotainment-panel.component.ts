import { Component, Input } from '@angular/core';
import { PoiService } from 'src/app/Services/poi.service';
import { PointOfInterest } from 'src/app/Services/models/poi';

@Component({
  selector: 'app-poi-infotainment-panel',
  templateUrl: './poi-infotainment-panel.component.html',
  styleUrls: ['./poi-infotainment-panel.component.css']
})
export class PoiInfotainmentPanelComponent {
  @Input()
  showInfotainmentPanel: boolean = false;
  @Input() selectedHexId: string = '';

  pois: PointOfInterest[] = [];

  constructor(private poiService: PoiService) {}

  ngOnInit(): void {
    this.fetchPois();
  }

  fetchPois(): void {
    this.pois = this.poiService.getPoIsByHexId(this.selectedHexId);
  }
}
