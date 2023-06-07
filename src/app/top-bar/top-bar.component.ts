import { Component, Output, EventEmitter } from '@angular/core';
import { SearchFunction } from '../Services/models/searchModels'


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  
})
export class TopBarComponent {
  searchText = '';
  searchBar = 'Search by Hex';
  isDropdownOpen = false;
  isSelectSearchOpen = true;
  selectedOption: string = '';
  @Output() searchTriggered: EventEmitter<[string,string]> = new EventEmitter<[string,string]>();
  @Output() clearSearchTriggered: EventEmitter<void> = new EventEmitter<void>();
  triggerSearch() { 
    if (this.searchBar === 'Search by Hex'){
      this.searchTriggered.emit([SearchFunction.SearchByHex,this.searchText]);
    }else if(this.searchBar === 'Search by POI'){
      this.searchTriggered.emit([SearchFunction.SearchByPoiId,this.searchText]);
    }else if(this.searchBar === 'Search by User ID'){
      this.searchTriggered.emit([SearchFunction.SearchByUser,this.searchText]);
    }
      
  }

  toggleDropdown() {
    this.isSelectSearchOpen = !this.isSelectSearchOpen;
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
    this.isSelectSearchOpen = !this.isSelectSearchOpen;
    this.searchText = ''
    if(this.selectedOption === SearchFunction.SearchByHex){
      this.searchBar = 'Search by Hex';
    }else if(this.selectedOption === SearchFunction.SearchByPoiId){
      this.searchBar = 'Search by POI';
    }else if(this.selectedOption === SearchFunction.SearchByUser){
      this.searchBar = 'Search by User ID';
    }
  }

  triggerClearSearch() {
    this.clearSearchTriggered.emit(); 
  }
}