import { Component, Output, EventEmitter } from '@angular/core';
import { SearchFunction } from '../Services/models/searchModels'
import { HomepageComponent } from '../homepage/homepage.component';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  
})
export class TopBarComponent {
  
  /**
   * The text entered by the user in the search bar.
   */
  searchText = '';
  
  /**
   * The label displayed in the search bar.
   */
  searchBar = 'Search by Hex';
  
  /**
   * The type of search function to be performed.
   */
  type: SearchFunction = SearchFunction.SearchByHex;
  
  /**
   * Event emitter triggered when a search is triggered.
   * Emits a tuple containing the search function type and the search text.
   */
  @Output() searchTriggered: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();
  
  /**
   * Event emitter triggered when a clear search is triggered.
   * Emits an empty event.
   */
  @Output() clearSearchTriggered: EventEmitter<void> = new EventEmitter<void>();
  
  /**
   * Creates an instance of the TopBarComponent.
   * @param homepage - The HomepageComponent instance.
   */
  constructor(private homepage: HomepageComponent) {}
  
  /**
   * Event handler for the key press event in the search input field.
   * Triggers a search if the Enter key is pressed.
   * @param event - The keyboard event.
   */
  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.triggerSearch();
      event.preventDefault();
    }
  }

  /**
   * Triggers a search with the selected search function type and search text.
   */
  triggerSearch() { 
    this.searchTriggered.emit([this.type,this.searchText]); 
  }


  /**
   * Switches the search functionality between different search options.
   * Updates the search bar label and the search function type accordingly.
   */
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

  /**
   * Triggers a clear search event.
   * Emits an empty event to clear the search results.
   */
  triggerClearSearch() {
    this.clearSearchTriggered.emit(); 
  }
}