import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css']
})
export class InfotainmentPanelComponent {
  showInfotainmentPanel = false;

  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
}
