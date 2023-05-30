import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { InfotainmentPanelComponent } from '../infotainment-panel/infotainment-panel.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  @ViewChild(TopBarComponent) topBarComponent!: TopBarComponent;
  @ViewChild(InfotainmentPanelComponent) infotainmentPanelComponent!: InfotainmentPanelComponent;
  title = 'Angular';
  handleSearchTriggered(hexagonId: string){
    const hexId = hexagonId.replace(/\s/g, "");
    this.mapComponent.findHexagon(hexId)
    this.infotainmentPanelComponent.searchedHex = hexId;
    this.infotainmentPanelComponent.chooseInfPanel = "hex"
    this.infotainmentPanelComponent.showInfotainmentPanel = true;
  }
  handleClearSearchTriggered(){
    this.mapComponent.clearSearch();
    this.infotainmentPanelComponent.showInfotainmentPanel = false;
  }
}
