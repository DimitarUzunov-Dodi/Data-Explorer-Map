import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  showInfotainmentPanel = false;
  // chooseInfPanel = "hex";
  // chooseInfPanel = "user";
  chooseInfPanel = "poi";
  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
}
