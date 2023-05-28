import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as h3 from 'h3-js';


@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
 
  private _foundHexId: string = '';
  parentHexId: string = '';
  showInfotainmentPanel = false;
  areaHex: number = 0;

  @Input()
  set foundHexId(value: string) {
    this._foundHexId = value;
    this.calculateParentHexId();
    this.calculateArea();
  }

  get foundHexId(): string {
    return this._foundHexId;
  }

  ngOnInit(): void {
    this.calculateParentHexId();
    this.calculateArea();
  }

  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
  calculateParentHexId(): void {
      const resoulution = h3.getResolution(this.foundHexId);
      if(resoulution!=-1){
        this.parentHexId =  h3.cellToParent(this.foundHexId, resoulution-1);
      }
    
    
  }
  calculateArea():void{
    const areaMeters = (h3.cellArea(this.foundHexId, 'km2')).toFixed(3);
    this.areaHex =+areaMeters;

  }
}
