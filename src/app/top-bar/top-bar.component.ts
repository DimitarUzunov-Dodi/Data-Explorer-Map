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
  constructor(private homepage: HomepageComponent, private poiService: PoiService){}
  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.triggerSearch();
      event.preventDefault();
    }
  }

  triggerSearch() { 
    this.search(this.searchText)
  }

  
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
  

  isValidPoi(poiId: string): boolean{
    return this.poiService.getPoiArr().filter(x => x.id === poiId.replace(/\s/g, "")).length > 0;
  }

  isValidUser(userId: string): boolean{
    return this.poiService.getPoiArr().filter(x => x.userId === userId).length > 0;
  }

  triggerClearSearch() {
    this.clearSearchTriggered.emit(); 
  }
}