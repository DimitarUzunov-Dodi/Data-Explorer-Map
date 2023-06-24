import { Component, Output, EventEmitter } from '@angular/core';
import { SearchFunction } from '../Services/models/searchModels';
import { HomepageComponent } from '../homepage/homepage.component';
import { cellToLatLng, getResolution, isValidCell } from 'h3-js';
import { PoiService } from '../Services/poi.service';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  
})
export class TopBarComponent {
  searchText = '';
  searchBar = 'Search...';
  selectedOption = '';
  type:SearchFunction = SearchFunction.SearchByHex;
  @Output() searchTriggered: EventEmitter<[string,string]> = new EventEmitter<[string,string]>();
  @Output() clearSearchTriggered: EventEmitter<void> = new EventEmitter<void>();
  constructor(private poiService: PoiService){}

  /**
  Handles the key press event when a user interacts with the search input field.
  Triggers a search operation if the Enter key is pressed.
  @param event - The KeyboardEvent object representing the key press event.
  @returns void
  */
  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.triggerSearch();
      event.preventDefault();
    }
  }
  /**

  Initiates a search operation with the provided search text.
  @param searchText - The text to be used for the search.
  @returns void
  */
  triggerSearch() { 
    this.search(this.searchText)
  }

  /**
  Performs a search operation based on the provided query.
  @param query - The query string to be used for the search.
  @returns void
  */
  search(query: string){
    try{
      if(isValidCell(query)){
        console.log("Enter hex")
        this.searchTriggered.emit([SearchFunction.SearchByHex,this.searchText]); 
      }else if(this.isValidPoi(query)){
        console.log("Enter poi")
        this.searchTriggered.emit([SearchFunction.SearchByPoiId,this.searchText]); 
      }else if(this.isValidUser(query)){
        console.log("Enter user")
        this.searchTriggered.emit([SearchFunction.SearchByUser,this.searchText]); 
      }else{
        console.log("Enter region")
        this.searchTriggered.emit([SearchFunction.SearchByRegion,this.searchText]); 
      }

    } catch(error){
      alert("Nothing found");
    }
  }
  
  /**
  Checks if a POI (Point of Interest) ID is valid.
  @param poiId - The POI ID to be validated.
  @returns boolean - Indicates whether the POI ID is valid (true) or not (false).
  */
  isValidPoi(poiId: string): boolean{
    return this.poiService.getPoiArr().filter(x => x.id === poiId.replace(/\s/g, "")).length > 0;
  }
  /**
  Checks if a User ID is valid.
  @param userId - The User ID to be validated.
  @returns boolean - Indicates whether the User ID is valid (true) or not (false).
  */
  isValidUser(userId: string): boolean{
    return this.poiService.getPoiArr().filter(x => x.userId === userId).length > 0;
  }

  /**
  Triggers the clear search operation.
  @returns void
  */
  triggerClearSearch() {
    this.clearSearchTriggered.emit(); 
  }
}
