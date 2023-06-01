import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  
})
export class TopBarComponent {
  searchText: string = '';
  searchBar: string = 'Search by Hex';
  @Output() searchTriggered: EventEmitter<[number,string]> = new EventEmitter<[number,string]>();
  @Output() clearSearchTriggered: EventEmitter<any> = new EventEmitter<any>();
  triggerSearch() { 
    if (this.searchBar == 'Search by Hex'){
      this.searchTriggered.emit([1,this.searchText]);
    } else if(this.searchBar == 'Search by POI'){
      this.searchTriggered.emit([2,this.searchText]);
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
