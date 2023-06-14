import { Component, Output, EventEmitter } from '@angular/core';
import { SearchFunction } from '../Services/models/searchModels'
import { HomepageComponent } from '../homepage/homepage.component';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  
})
export class TopBarComponent {
  searchText = '';
  searchBar = 'Search by Hex';
  selectedOption = '';
  type:SearchFunction = SearchFunction.SearchByHex;
  @Output() searchTriggered: EventEmitter<[string,string]> = new EventEmitter<[string,string]>();
  @Output() clearSearchTriggered: EventEmitter<void> = new EventEmitter<void>();
  constructor(private homepage: HomepageComponent){}
  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.triggerSearch();
      event.preventDefault();
    }
  }

  triggerSearch() { 
    this.searchTriggered.emit([this.type,this.searchText]); 
  }


  switchSearch() {
    this.searchText = ''
    if(this.searchBar === 'Search by Hex'){
      this.searchBar = 'Search by POI';
      this.type = SearchFunction.SearchByPoiId
    }else if(this.searchBar === 'Search by POI'){
      this.searchBar = 'Search by User ID';
      this.type = SearchFunction.SearchByUser
    }else if(this.searchBar === 'Search by User ID'){
      this.searchBar = 'Search by Region';
      this.type = SearchFunction.SearchByRegion
    }
    else if(this.searchBar === 'Search by Region'){
      this.searchBar = 'Search by Hex';
      this.type = SearchFunction.SearchByHex
    }
  }

  triggerClearSearch() {
    this.clearSearchTriggered.emit(); 
  }
}