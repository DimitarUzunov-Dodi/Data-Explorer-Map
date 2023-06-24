import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';

import { TopBarComponent } from './top-bar.component';
import { PoiService } from '../Services/poi.service';
import { SearchFunction } from '../Services/models/searchModels';
import { RoadHazardType } from '../Services/models/poi';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;
  let poiService: PoiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarComponent],
      imports: [FormsModule],
      providers: [PoiService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    poiService = TestBed.inject(PoiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSearchKeyPress should trigger search when Enter key is pressed', () => {
    const event = new KeyboardEvent('keypress', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    spyOn(component, 'triggerSearch');

    component.onSearchKeyPress(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.triggerSearch).toHaveBeenCalled();
  });

  it('onSearchKeyPress should not trigger search when key other than Enter is pressed', () => {
    const event = new KeyboardEvent('keypress', { key: 'Space' });
    spyOn(event, 'preventDefault');
    spyOn(component, 'triggerSearch');

    component.onSearchKeyPress(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(component.triggerSearch).not.toHaveBeenCalled();
  });

  it('triggerSearch should call search method with the provided search text', () => {
    spyOn(component, 'search');

    component.searchText = 'hex123';
    component.triggerSearch();

    expect(component.search).toHaveBeenCalledWith('hex123');
  });

  it('search should emit SearchByHex event when the query is a valid hex', () => {
    const query = '891ec13b187ffff';
    component.searchText = query;
    spyOn(component, 'isValidPoi');
    spyOn(component, 'isValidUser');

    const emitSpy = spyOn(component.searchTriggered, 'emit');

    component.search(query);

    expect(component.isValidPoi).not.toHaveBeenCalled();
    expect(component.isValidUser).not.toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith([SearchFunction.SearchByHex, query]);
  });

  it('search should emit SearchByPoiId event when the query is a valid POI', () => {
    const query = '368696';
    component.searchText = query;
    spyOn(component, 'isValidPoi').and.returnValue(true);
    spyOn(component, 'isValidUser');

    const emitSpy = spyOn(component.searchTriggered, 'emit');

    component.search(query);

    expect(component.isValidPoi).toHaveBeenCalled();
    expect(component.isValidUser).not.toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith([SearchFunction.SearchByPoiId, query]);
  });

  it('search should emit SearchByUser event when the query is a valid user', () => {
    const query = 'user1';
    component.searchText = query;
    spyOn(component, 'isValidPoi');
    spyOn(component, 'isValidUser').and.returnValue(true);

    const emitSpy = spyOn(component.searchTriggered, 'emit');

    component.search(query);

    expect(component.isValidPoi).toHaveBeenCalled();
    expect(component.isValidUser).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith([SearchFunction.SearchByUser, query]);
  });

  it('search should emit SearchByRegion event when the query is not a valid cell, POI, or user', () => {
    const query = 'Sofia';
    component.searchText = query;
    spyOn(component, 'isValidPoi');
    spyOn(component, 'isValidUser');

    const emitSpy = spyOn(component.searchTriggered, 'emit');

    component.search(query);

    expect(component.isValidPoi).toHaveBeenCalled();
    expect(component.isValidUser).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith([SearchFunction.SearchByRegion, query]);
  });

  it('isValidPoi should return true when the POI ID is valid', () => {
    const poiId = '368696';
    const poiArr = [
      {
        id: "368696",
        type: RoadHazardType.Police,
        createdAt: new Date('2016-11-04T16:57:11.718Z'),
        hexId: "891eccb6ecbffff",
        status: "Active",
        note: "mock_note",
        userId: 'user1'
      }
    ];
    spyOn(poiService, 'getPoiArr').and.returnValue(poiArr);

    const isValidPoi = component.isValidPoi(poiId);

    expect(poiService.getPoiArr).toHaveBeenCalled();
    expect(isValidPoi).toBeTrue();
  });

  it('isValidPoi should return false when the POI ID is not valid', () => {
    const poiId = '368697';
    const poiArr = [
      {
        id: "368696",
        type: RoadHazardType.Police,
        createdAt: new Date('2016-11-04T16:57:11.718Z'),
        hexId: "891eccb6ecbffff",
        status: "Active",
        note: "mock_note",
        userId: 'user1'
      }
    ];
    spyOn(poiService, 'getPoiArr').and.returnValue(poiArr);

    const isValidPoi = component.isValidPoi(poiId);

    expect(poiService.getPoiArr).toHaveBeenCalled();
    expect(isValidPoi).toBeFalse();
  });

  it('isValidUser should return true when the User ID is valid', () => {
    const userId = 'user1';
    const poiArr = [
      {
        id: "368696",
        type: RoadHazardType.Police,
        createdAt: new Date('2016-11-04T16:57:11.718Z'),
        hexId: "891eccb6ecbffff",
        status: "Active",
        note: "mock_note",
        userId: 'user1'
      }
    ];
    spyOn(poiService, 'getPoiArr').and.returnValue(poiArr);

    const isValidUser = component.isValidUser(userId);

    expect(poiService.getPoiArr).toHaveBeenCalled();
    expect(isValidUser).toBeTrue();
  });

  it('isValidUser should return false when the User ID is not valid', () => {
    const userId = 'user2';
    const poiArr = [
      {
        id: "368696",
        type: RoadHazardType.Police,
        createdAt: new Date('2016-11-04T16:57:11.718Z'),
        hexId: "891eccb6ecbffff",
        status: "Active",
        note: "mock_note",
        userId: 'user1'
      }
    ];
    spyOn(poiService, 'getPoiArr').and.returnValue(poiArr);

    const isValidUser = component.isValidUser(userId);

    expect(poiService.getPoiArr).toHaveBeenCalled();
    expect(isValidUser).toBeFalse();
  });
});