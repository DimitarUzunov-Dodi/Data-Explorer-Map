import { Component, Output, EventEmitter } from '@angular/core';
import { AggregatorService } from 'src/app/aggregator/aggregator.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  
})
export class TopBarComponent {
  searchText: string = '';
  @Output() searchTriggered: EventEmitter<string> = new EventEmitter<string>();
  @Output() clearSearchTriggered: EventEmitter<any> = new EventEmitter<any>();
  constructor(private aggregatorService: AggregatorService) { }
  triggerSearch() {
    this.searchTriggered.emit(this.searchText); 
  }
  triggerClearSearch() {
    this.clearSearchTriggered.emit(); 
  }

}
