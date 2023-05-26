import { Component, ViewChild} from '@angular/core';
import { MapComponent } from './map/map.component';
import { map } from 'rxjs';
import { FilterCheckbox } from './filter/filter.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  title = 'Angular';
  handleSearchTriggered(hexagonId: string){
    this.mapComponent.findHexagon(hexagonId)
    
  }
  handleClearSearchTriggered(){
    this.mapComponent.clearSearch();
    
  }
  
}


