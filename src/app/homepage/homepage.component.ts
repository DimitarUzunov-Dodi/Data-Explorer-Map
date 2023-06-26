import { Component, ViewChild, Input } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { InfotainmentPanelComponent } from '../infotainment-panel/infotainment-panel.component';
import { FilterCheckbox } from '../filter/filter.component';
import { RoadHazardType } from '../Services/models/poi';
import { HexagonInfotainmentPanelComponent } from '../infotainment-panel/hexagon-infotainment-panel/hexagon-infotainment-panel.component';
import { SearchFunction } from '../Services/models/searchModels';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  
  /**
   * Reference to the MapComponent child component.
   */
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  
  /**
   * Reference to the TopBarComponent child component.
   */
  @ViewChild(TopBarComponent) topBarComponent!: TopBarComponent;
  
  /**
   * Reference to the InfotainmentPanelComponent child component.
   */
  @ViewChild(InfotainmentPanelComponent) infotainmentPanelComponent!: InfotainmentPanelComponent;
  
  /**
   * Reference to the FilterCheckbox child component.
   */
  @ViewChild(FilterCheckbox) filterCheckbox!: FilterCheckbox;
  
  /**
   * Represents the current search tuple [searchFunctionType, searchText].
   */
  current: [string, string] | undefined = undefined;
  
  /**
   * Represents the past search tuples.
   */
  past: [string, string][] = [];
  
  /**
   * Represents the future search tuples.
   */
  future: [string, string][] = [];
  
  /**
   * The title of the RoadSense application.
   */
  title = 'RoadSense';
  
  /**
   * Set of hexagons used for the map.
   */
  hexagons: Set<string> = new Set<string>();
  
  /**
   * Handles the search trigger event by enqueuing the search tuple and performing the search on the map component.
   * @param searchTuple - The search tuple [searchFunctionType, searchText].
   */
  async handleSearchTriggeredWithEnqueue(searchTuple: [string,string]){
    const success = this.handleSearchTriggered(searchTuple);
    if (await success){
      this.enqueue(searchTuple, this.past);
    }
  }

  /**
   * Handles the search trigger event by performing the search on the map component.
   * @param searchTuple - The search tuple [searchFunctionType, searchText].
   * @returns A promise that resolves to a boolean indicating the success of the search.
   */
  async handleSearchTriggered(searchTuple: [string,string]): Promise<boolean>{
    this.mapComponent.clearSearch()
    switch (searchTuple[0]) {
      case SearchFunction.SearchByHex:
        return this.mapComponent.findHexagon(searchTuple[1]);
      case SearchFunction.SearchByPoiId:
        return this.mapComponent.findPoi(searchTuple[1]);
      case SearchFunction.SearchByUser:
        return this.mapComponent.findUser(searchTuple[1]);
      case SearchFunction.SearchByRegion:
        return this.mapComponent.findRegion(searchTuple[1]);
    }
    return false;
  }

  /**
   * Handles the info panel trigger event by showing the infotainment panel with the selected search information.
   * @param searchTuple - The search tuple [searchFunctionType, searchText].
   */
  async handleInfoPanelTriggered(searchTuple: [string,string]){
    
    const id = searchTuple[1].replace(/\s/g, "");
    this.infotainmentPanelComponent.searchedId = id
    this.infotainmentPanelComponent.showInfotainmentPanel = true;
    this.infotainmentPanelComponent.chooseInfPanel = searchTuple[0];
  }

  /**
   * Handles the clear search trigger event by clearing the search results and resetting the components.
   */
  handleClearSearchTriggered(){
    this.mapComponent.clearSearch();
    this.infotainmentPanelComponent.chooseInfPanel = ""
    this.infotainmentPanelComponent.showInfotainmentPanel = false;
    this.topBarComponent.searchText = "" 
  }

  /**
   * Handles the selection of all hazards checkboxes.
   * Updates the map component with the selected hazards and visualizes the map.
   * @param status - The status indicating whether all hazards are selected or not.
   */
  allHazardsSelection(status: boolean) {
    try {
      if(status) {
        this.mapComponent.updateHazards(new Set(Object.values(RoadHazardType)));
      } else {
        this.mapComponent.updateHazards(new Set());
      }
    } catch (error) {
      console.log(error);
    }
    this.mapComponent.visualizeMap();
  }

  /**
   * Handles the change in hazard checkbox status.
   * Updates the map component with the selected hazard and visualizes the map.
   * @param status - The status indicating whether the hazard checkbox is checked or not.
   */
  handleHazardCheckboxChange(status: [hazType: string, isChecked: boolean]) {
    try {
      const currentHaz : Set<RoadHazardType> = this.mapComponent.searchedHazards;
      if (status[1]) {
        currentHaz.add(status[0] as RoadHazardType);
      } else {
        currentHaz.delete(status[0] as RoadHazardType);
      }
      this.mapComponent.updateHazards(currentHaz);
      this.mapComponent.visualizeMap();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Enqueues the search tuple into the stack of past searches.
   * Updates the current search tuple if the stack is empty.
   * @param element - The search tuple [searchFunctionType, searchText].
   * @param stack - The stack of past search tuples.
   */
  enqueue(element: [string, string], stack: [string, string][]): void {
    if (this.isEmpty(stack) && this.current == undefined){
      this.current = element;
    }
    else if (this.current != undefined){
      stack.push(this.current);
      this.current = element;
    }
    this.future = [];
  }

  /**
   * Pops and returns the top element from the stack.
   * @param stack - The stack of search tuples.
   * @returns The popped search tuple.
   * @throws An error if the stack is empty.
   */
  pop(stack: [string, string][]): any {
    if (this.isEmpty(stack)) {
      throw new Error("Stack is empty")
    }
    else {
      const res = this.current
      this.current = stack.pop();
      return res;
    }
  }

  /**
   * Checks if the stack is empty.
   * @param stack - The stack of search tuples.
   * @returns A boolean indicating whether the stack is empty or not.
   */
  isEmpty(stack: [string, string][]): boolean {
    return stack.length === 0;
  }
}
