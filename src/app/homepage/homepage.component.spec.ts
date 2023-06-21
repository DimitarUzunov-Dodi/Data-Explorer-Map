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

  it('should enqueue the element and update current if stack is empty', () => {
    const element: [string, string] = ['functionType', 'searchText'];
    const stack: [string, string][] = [];
    const expectedStack: [string, string][] = [];
    const expectedCurrent: [string, string] = ['functionType', 'searchText'];
    const expectedFuture: [string, string][] = [];

    component.enqueue(element, stack);

    expect(stack).toEqual(expectedStack);
    expect(component.current).toEqual(expectedCurrent);
    expect(component.future).toEqual(expectedFuture);
  });

  it("should pop and return the top element from the stack, and throw an error when is empty", () => {
    let stack: [string, string][]
    stack = [['hex', '881ec218e9fffff'], ['poi', '1539639'], ['user', 'user2']];
    component.pop(stack);
    expect(component.current).toEqual(['user', 'user2']);
    expect(stack).toEqual([['hex', '881ec218e9fffff'], ['poi', '1539639']]);
    component.pop(stack);
    expect(component.current).toEqual(['poi', '1539639']);
    expect(stack).toEqual([['hex', '881ec218e9fffff']]);
    component.pop(stack);
    expect(component.current).toEqual(['hex', '881ec218e9fffff']);
    expect(stack).toEqual([]);
    expect(() => component.pop(stack)).toThrow(new Error("Stack is empty"));
  });

  it("should return true for an empty stack", () => {
    const stack: [string, string][] = [];
    const result = component.isEmpty(stack);
    expect(result).toBe(true);
  });

  it("should return false for a non-empty stack", () => {
    const stack: [string, string][] =  [['item1', 'value1'], ['item2', 'value2']];
    const result = component.isEmpty(stack);
    expect(result).toBe(false);
  });


});


