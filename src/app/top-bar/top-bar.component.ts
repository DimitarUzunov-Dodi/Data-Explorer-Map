import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  
})
export class TopBarComponent {
  searchText = '';
  @Output() searchTriggered: EventEmitter<string> = new EventEmitter<string>();
  @Output() clearSearchTriggered: EventEmitter<any> = new EventEmitter<any>();
  triggerSearch() {
    this.searchTriggered.emit(this.searchText); 
  }
  triggerClearSearch() {
    this.clearSearchTriggered.emit(); 
  }

}
