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
  parentHexId: string = '';


  hexagonInfotainmentPanel: HexagonInfotainmentPanelComponent | null = null;
  area: number = 0;

  calculateParentHexId(): void {
    const resoulution = h3.getResolution(this.searchedHex);
    if(resoulution!=-1){
      this.parentHexId=  h3.cellToParent(this.searchedHex, resoulution-1);
    }
  }

  calculateArea():void{
    const areaMeters = (h3.cellArea(this.searchedHex, 'km2')).toFixed(3);
    this.area =+areaMeters;

  }

  ngOnInit(): void {
    this.calculateParentHexId();
    this.calculateArea();
  }
}