import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AggregatorService } from 'src/app/aggregator/aggregator.service';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  showInfotainmentPanel = false;
  @Output() searchTriggered: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private aggregatorService: AggregatorService) { }
  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
  triggerMethod() {
    this.searchTriggered.emit();
  }
}
