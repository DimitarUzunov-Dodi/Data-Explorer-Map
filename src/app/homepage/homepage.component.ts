import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  title = 'Angular';
  handleSearchTriggered(hexagonId: string){
    this.mapComponent.findHexagon(hexagonId)
    
  }
  handleClearSearchTriggered(){
    this.mapComponent.clearSearch();
    
  }
}
