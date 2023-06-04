import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { InfotainmentPanelComponent } from '../infotainment-panel/infotainment-panel.component';
import { FilterCheckbox } from '../filter/filter.component';
import { RoadHazardType } from '../Services/models/poi';
import { HexagonInfotainmentPanelComponent } from '../infotainment-panel/hexagon-infotainment-panel/hexagon-infotainment-panel.component';

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
  @ViewChild(HexagonInfotainmentPanelComponent) hexInfotainmentPanel!: HexagonInfotainmentPanelComponent;

  title = 'Angular';
  async handleSearchTriggered(searchTouple: [string,string]){
    this.mapComponent.findHexagon(searchTouple)
    const hexId = searchTouple[1].replace(/\s/g, "");
    this.infotainmentPanelComponent.searchedHex = hexId
    this.infotainmentPanelComponent.showInfotainmentPanel = true;
    this.infotainmentPanelComponent.chooseInfPanel = searchTouple[0];

  }
  handleClearSearchTriggered(){
    this.mapComponent.clearSearch();
    this.infotainmentPanelComponent.chooseInfPanel = ""
    this.infotainmentPanelComponent.showInfotainmentPanel = false;
    this.hexInfotainmentPanel.showInfotainmentPanel =false;
    this.hexInfotainmentPanel.poiPanel = false;
    this.hexInfotainmentPanel.showUserInfotainment=false;
    this.topBarComponent.searchText = "" 
  }

  allHazardsSelection(status: boolean) {
    try {
      if(status) {
        this.mapComponent.updateHazards(new Set(Object.values(RoadHazardType)));
        console.log("Selected All");
      } else {
        this.mapComponent.updateHazards(new Set());
        console.log("Deselected All");
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
}
