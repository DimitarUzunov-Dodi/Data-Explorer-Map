import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  
})
export class TopBarComponent {
  searchText: string = '';
  searchBar: string = 'Search by Hex';
  @Output() searchTriggered: EventEmitter<string> = new EventEmitter<string>();
  @Output() clearSearchTriggered: EventEmitter<any> = new EventEmitter<any>();
  triggerSearch() {
    this.searchTriggered.emit(this.searchText); 
  }
  switchSearch() {
    if(this.searchBar === 'Search by Hex'){
      this.searchBar = 'Search by POI';
    }else{
      this.searchBar = 'Search by Hex';
    }
  }
  triggerClearSearch() {
    this.clearSearchTriggered.emit(); 
  }

}
