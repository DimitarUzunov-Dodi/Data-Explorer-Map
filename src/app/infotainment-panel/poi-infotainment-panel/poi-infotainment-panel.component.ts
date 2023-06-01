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

  pois: PointOfInterest[] = [];

  @Input() poiPerHexPerResolution: Map<number, Map<string, PointOfInterest[]>> = 
    new Map<number, Map<string, PointOfInterest[]>>();

  constructor(private poiService: PoiService) {}

  ngOnInit(): void {
    this.fetchPois();
  }

  fetchPois(): void {
    
    const smth = (this.poiPerHexPerResolution.get(h3.getResolution(this.selectedHexId)))?.get(this.selectedHexId)
    if (smth) {
      this.pois = smth;
    } else {
      this.pois = [];
    }
    console.log(this.pois)
   //this.pois  = this.poiService.getPoIsByHexId(this.selectedHexId);
  }
}
