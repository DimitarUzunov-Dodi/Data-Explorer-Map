import { Component, ViewChild } from '@angular/core';
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
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  @ViewChild(TopBarComponent) topBarComponent!: TopBarComponent;
  @ViewChild(InfotainmentPanelComponent) infotainmentPanelComponent!: InfotainmentPanelComponent;
  @ViewChild(FilterCheckbox) filterCheckbox!: FilterCheckbox;
  current: [string, string] | undefined = undefined;
  past: [string,string][] = [];
  future: [string,string][] = [];
  title = 'RoadSense';

  async handleSearchTriggeredWithEnqueue(searchTuple: [string,string]){
    const success = this.handleSearchTriggered(searchTuple);
    if (await success){
      this.enqueue(searchTuple, this.past);
      console.log(this.past)
      console.log(this.current)
      console.log(this.future)
    }
  }
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

  async handleInfoPanelTriggered(searchTouple: [string,string]){
    
    const id = searchTouple[1].replace(/\s/g, "");
    this.infotainmentPanelComponent.searchedId = id
    this.infotainmentPanelComponent.showInfotainmentPanel = true;
    this.infotainmentPanelComponent.chooseInfPanel = searchTouple[0];

  }

  handleClearSearchTriggered(){
    this.mapComponent.clearSearch();
    this.infotainmentPanelComponent.chooseInfPanel = ""
    this.infotainmentPanelComponent.showInfotainmentPanel = false;
    this.topBarComponent.searchText = "" 
  }

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

  enqueue(element: [string, string], stack: [string, string][]): void {
    if (this.isEmpty(stack) && this.current == undefined){
      console.log("Case 1")
      this.current = element;
    }
    else if (this.current != undefined){
      console.log("Case 2")
      stack.push(this.current);
      this.current = element;
    }
    this.future = [];
  }
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
  isEmpty(stack: [string, string][]): boolean {
    return stack.length === 0;
  }
}
