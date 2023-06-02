import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  
})
export class TopBarComponent {
  searchText = '';
  searchBar = 'Search by Hex';
  @Output() searchTriggered: EventEmitter<[string,string]> = new EventEmitter<[string,string]>();
  @Output() clearSearchTriggered: EventEmitter<void> = new EventEmitter<void>();
  triggerSearch() { 
    if (this.searchBar == 'Search by Hex'){
      this.searchTriggered.emit(['hex',this.searchText]);
    } else if(this.searchBar == 'Search by POI'){
      this.searchTriggered.emit(['poi',this.searchText]);
    }
      
  }
  switchSearch() {
    this.searchText = ''
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
