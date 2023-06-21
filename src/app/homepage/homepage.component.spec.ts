import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Output, EventEmitter } from '@angular/core';
import { HomepageComponent } from './homepage.component';
import { FilterCheckbox } from '../filter/filter.component';
import { InfotainmentPanelComponent } from '../infotainment-panel/infotainment-panel.component';
import { MapComponent } from '../map/map.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { SearchFunction } from '../Services/models/searchModels';
import { FormsModule } from '@angular/forms';
import { RoadHazardType } from '../Services/models/poi';



@Component({
  selector: 'app-top-bar',
  template: '',
})
class MockTopBarComponent {
  @Output() searchTriggered = new EventEmitter();
  @Output() clearSearchTriggered = new EventEmitter();
}


@Component({
  selector: 'app-map',
  template: '',
})
class MockMapComponent {}

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        HomepageComponent,
        MapComponent,
        TopBarComponent,
        InfotainmentPanelComponent,
        FilterCheckbox
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle search trigger and call map component methods for hex search', async () => {
    spyOn(component.mapComponent, 'clearSearch');
    spyOn(component.mapComponent, 'findHexagon').and.returnValue(true);
  
    const searchTuple: [string, string] = [SearchFunction.SearchByHex, '881ec218e9fffff'];
  
    const success = await component.handleSearchTriggered(searchTuple);
  
    expect(component.mapComponent.clearSearch).toHaveBeenCalled();
    expect(component.mapComponent.findHexagon).toHaveBeenCalledWith('881ec218e9fffff');
    expect(success).toBe(true);
  });

  it('should handle search trigger and call map component methods for poi search', async () => {
    spyOn(component.mapComponent, 'clearSearch');
    spyOn(component.mapComponent, 'findPoi').and.returnValue(true);
  
    const searchTuple: [string, string] = [SearchFunction.SearchByPoiId, '1539639'];
  
    const success = await component.handleSearchTriggered(searchTuple);
  
    expect(component.mapComponent.clearSearch).toHaveBeenCalled();
    expect(component.mapComponent.findPoi).toHaveBeenCalledWith('1539639');
    expect(success).toBe(true);
  });

  it('should handle search trigger and call map component methods for user search', async () => {
    spyOn(component.mapComponent, 'clearSearch');
    spyOn(component.mapComponent, 'findUser').and.returnValue(true);
  
    const searchTuple: [string, string] = [SearchFunction.SearchByUser, 'user2'];
  
    const success = await component.handleSearchTriggered(searchTuple);
  
    expect(component.mapComponent.clearSearch).toHaveBeenCalled();
    expect(component.mapComponent.findUser).toHaveBeenCalledWith('user2');
    expect(success).toBe(true);
  });

  it('should handle search trigger and call map component methods for region search', async () => {
    spyOn(component.mapComponent, 'clearSearch');
    spyOn(component.mapComponent, 'findRegion').and.returnValue(Promise.resolve(true));
  
    const searchTuple: [string, string] = [SearchFunction.SearchByRegion, 'Bulgaria'];
  
    const success = await component.handleSearchTriggered(searchTuple);
  
    expect(component.mapComponent.clearSearch).toHaveBeenCalled();
    expect(component.mapComponent.findRegion).toHaveBeenCalledWith('Bulgaria');
    expect(success).toBe(true);
  });


  it('should handle info panel trigger and update infotainment panel component', () => {
    const searchTuple: [string, string] = [SearchFunction.SearchByHex, 'hexagon'];

    component.handleInfoPanelTriggered(searchTuple);

    expect(component.infotainmentPanelComponent.searchedId).toBe('hexagon');
    expect(component.infotainmentPanelComponent.showInfotainmentPanel).toBe(true);
    expect(component.infotainmentPanelComponent.chooseInfPanel).toBe(SearchFunction.SearchByHex);
  });

  it('should update hazards with all hazard types and visualize the map when status is true', () => {
    spyOn(component.mapComponent, 'updateHazards');
    spyOn(component.mapComponent, 'visualizeMap');
  
    component.allHazardsSelection(true);
  
    expect(component.mapComponent.updateHazards).toHaveBeenCalledWith(new Set(Object.values(RoadHazardType)));
    expect(component.mapComponent.visualizeMap).toHaveBeenCalled();
  });
  
  it('should update hazards with the selected hazard type and visualize the map when status is false', () => {
    spyOn(component.mapComponent, 'updateHazards');
    spyOn(component.mapComponent, 'visualizeMap');
  
    const hazardType: RoadHazardType = RoadHazardType.Fog;
  
    component.handleHazardCheckboxChange([hazardType, false]);
    const hazardSet: Set<RoadHazardType> = new Set<RoadHazardType>();

    hazardSet.add(RoadHazardType.Potholes);
    hazardSet.add(RoadHazardType.Aquaplaning);
    hazardSet.add(RoadHazardType.IcyRoads);
    hazardSet.add(RoadHazardType.TrafficJams);
    hazardSet.add(RoadHazardType.RoadEmergencies);
    hazardSet.add(RoadHazardType.RoadConditions);
    hazardSet.add(RoadHazardType.Police);
    hazardSet.add(RoadHazardType.CamerasAndRadars);
    hazardSet.add(RoadHazardType.Incidents);

    expect(component.mapComponent.updateHazards).toHaveBeenCalledWith(hazardSet);
    expect(component.mapComponent.visualizeMap).toHaveBeenCalled();
  });
});