import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  showInfotainmentPanel = false;
  @Output() searchTriggered: EventEmitter<any> = new EventEmitter<any>();

  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
  triggerMethod() {
    this.searchTriggered.emit();
  }
}
