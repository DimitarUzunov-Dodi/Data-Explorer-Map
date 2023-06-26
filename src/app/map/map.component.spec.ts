import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { PoiService } from '../Services/poi.service';
import { PointOfInterest, RoadHazardType } from '../Services/models/poi';
import { ElementRef } from '@angular/core';
import { MAP_STYLES } from '../Services/models/mapStyle';
import { resolutionLevel } from '../Services/models/mapModels';
import * as h3 from 'h3-js';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let poiService: PoiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapComponent],
      providers: [HomepageComponent, PoiService]
    }).compileComponents();
  });

  beforeEach(() => {
    
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    poiService = TestBed.inject(PoiService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ngOnInit
  it('should load and process data from JSON file during initialization', async () => {
    const poi: PointOfInterest = {
      id: '135892',
      type: RoadHazardType.Police,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId: '891eccb6ecbffff',
      status: 'Active',
      note: 'mock_note',
      userId: 'user1'
    };
    const inp = new Map<string, PointOfInterest[]>();
    inp.set('891eccb6ecbffff', [poi]);

    spyOn(poiService, 'processJson').and.callThrough();
    spyOn(poiService, 'getPoiMap').and.returnValue(inp);

    const response = await fetch('./assets/mock_data_explorer.json');
    const jsonData = await response.json();
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        json: () => Promise.resolve(jsonData)
      } as Response)
    );

    await component.ngOnInit();

    expect(window.fetch).toHaveBeenCalledWith('./assets/mock_data_explorer.json');
    expect(poiService.processJson).toHaveBeenCalledWith(jsonData);
    expect(poiService.getPoiMap).toHaveBeenCalled();
    expect(component.hexagonIds.size).toBe(1); // Adjust the expected size based on your mock data
  });

  it('should handle error during data loading', async () => {
    spyOn(poiService, 'processJson').and.callThrough();
    spyOn(poiService, 'getPoiMap').and.returnValue(new Map<string, PointOfInterest[]>());
    
    const response = await fetch('./assets/mock_data_explorer.json');
    const jsonData = await response.json();

    await component.ngOnInit();

    expect(poiService.processJson).toHaveBeenCalledWith(jsonData);
    expect(poiService.getPoiMap).toHaveBeenCalled();
    expect(component.hexagonIds.size).toBe(0); // Adjust the expected size based on your mock data
  });

  // ngAfterViewInit
  it('should initialize the map with current position if geolocation is available', () => {
    const mockPosition: GeolocationPosition = {
      coords: {
        latitude: 40.712776,
        longitude: -74.005974,
        accuracy: 0,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    };

    spyOn(navigator.geolocation, 'getCurrentPosition')
      .and.callFake((successCallback: PositionCallback, errorCallback: PositionErrorCallback) => {
        successCallback(mockPosition);
      });

    spyOn(component, 'initializeMap');

    component.ngAfterViewInit();

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    const defaultLat = 40.712776;
    const defaultLng = -74.005974;
    expect(component.center.lat()).toEqual(defaultLat);
    expect(component.center.lng()).toEqual(defaultLng);
    expect(component.initializeMap).toHaveBeenCalled();
  });

  it('should initialize the map without current position if geolocation permission is denied', () => {
    const mockError: GeolocationPositionError = {
      code: 1,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      message: ''
    };
  
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
      (successCallback: PositionCallback, errorCallback: PositionErrorCallback) => {
        errorCallback(mockError);
      }
    );
  
    spyOn(component, 'initializeMap');
  
    component.ngAfterViewInit();
  
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    const defaultLat = 37.7749;
    const defaultLng = -122.4194;
    expect(component.center.lat()).toEqual(defaultLat);
    expect(component.center.lng()).toEqual(defaultLng);
    expect(component.initializeMap).toHaveBeenCalled();
  });

  //clearSearch
  it('should clear search data and visualize the map', () => {
    // Arrange
    component.searchHexIds = new Set<string>
    component.searchUserHexIds = new Set<string>
    component.smallHexToDisplay = new  Set<string>
  
    spyOn(component, 'visualizeMap');
  
    // Act
    component.clearSearch();
  
    // Assert
    expect(component.searchHexIds.size).toBe(0);
    expect(component.searchUserHexIds.size).toBe(0);
    expect(component.smallHexToDisplay.size).toBe(0);
    expect(component.visualizeMap).toHaveBeenCalled();
  });

  //triggerInfoPanel
  it('should emit showInfotainmentPanel event with the provided infoTuple', () => {
    const infoTuple: [string, string] = ['Info 1', 'Info 2'];
    spyOn(component.showInfotainmentPanel, 'emit');

    component.triggerInfoPanel(infoTuple);
  
    expect(component.showInfotainmentPanel.emit).toHaveBeenCalledWith(infoTuple);
  });

  //calculateHexagonDensity
  it('should calculate the density correctly', () => {
    const poisPerHex = new Map<string, PointOfInterest[]>();
    poisPerHex.set('hex1', [
      { id: '1', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note1', userId: 'user1' },
      { id: '2', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note2', userId: 'user2' },
      { id: '3', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note3', userId: 'user1' }
    ]);
    poisPerHex.set('hex2', [
      { id: '4', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex2', status: 'Active', note: 'Note4', userId: 'user2' },
      { id: '5', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex2', status: 'Active', note: 'Note5', userId: 'user1' }
    ]);
    const expectedDensities = new Map<string, number>();
    expectedDensities.set('hex1', 1);
    expectedDensities.set('hex2', 0.6666666666666666);
    const densities = component.calculateHexagonDensity(poisPerHex);
    expect(densities).toEqual(expectedDensities);
  });

  it('should handle empty poisPerHex map', () => {
    const poisPerHex = new Map<string, PointOfInterest[]>();
    const expectedDensities = new Map<string, number>();
    const densities = component.calculateHexagonDensity(poisPerHex);
    expect(densities).toEqual(expectedDensities);
  });

  it('should handle poisPerHex map with missing hexagons', () => {
    const poisPerHex = new Map<string, PointOfInterest[]>();
    poisPerHex.set('hex1', [
      { id: '1', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note1', userId: 'user1' },
      { id: '2', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note2', userId: 'user2' }
    ]);
    poisPerHex.set('hex2', []);
    const expectedDensities = new Map<string, number>();
    expectedDensities.set('hex1', 1);
    expectedDensities.set('hex2', 0);
    const densities = component.calculateHexagonDensity(poisPerHex);
    expect(densities).toEqual(expectedDensities);
  });

  //updatehazards
  it('updateHazards', () => {
    const neededHazards = new Set<RoadHazardType>
    neededHazards.add(RoadHazardType.Fog)
    neededHazards.add(RoadHazardType.Police)
    component.updateHazards(neededHazards);
    expect(component.searchedHazards).toEqual(neededHazards);
  });

  //initializeMap
  it('initializeMap', () => {
    const center = new google.maps.LatLng(37.7749, -122.4194);
    const zoom = 12;
    const mapOptions: google.maps.MapOptions = {
      mapTypeId: 'roadmap',
      backgroundColor: '#212121',
      styles: MAP_STYLES,
      disableDefaultUI: true,
      maxZoom: 20,
      minZoom: 1,
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -180,
          east: 180,
        },
        strictBounds: true,
      },
    };
    component.center = center;
    component.zoom = zoom;
    component.mapOptions = mapOptions;
    component.initializeMap();
    expect(component.map).toBeDefined();
    expect(component.map.getCenter()).toEqual(center);
  });

  //filterInBounds
  it('filterInBounds', () => {
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(42.4391223, 27.3580761),
      new google.maps.LatLng(42.6139216, 27.5458556)
      
    );
  
    component.hexagonIds = new Set<string>(['881eccb6edfffff', '881eccb409fffff', '881eccb40bfffff', '881eccb2a7fffff']);
    const result = component.filterInBounds(bounds);


    expect(result).toEqual(new Set<string>(['881eccb6edfffff', '881eccb409fffff', '881eccb40bfffff']));
  });

  //visualizeMap
  it('visualizeMap', fakeAsync(() => {
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(42.4391223, 27.3580761),
      new google.maps.LatLng(42.6139216, 27.5458556)
    );
    const center = new google.maps.LatLng(37.7749, -122.4194);
    const zoom = 12;
    const mapOptions: google.maps.MapOptions = {
      mapTypeId: 'roadmap',
      backgroundColor: '#212121',
      styles: MAP_STYLES,
      disableDefaultUI: true,
      maxZoom: 20,
      minZoom: 1,
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -180,
          east: 180,
        },
        strictBounds: true,
      },
    };
    component.center = center;
    component.zoom = zoom;
    component.mapOptions = mapOptions;
    component.initializeMap();
  
    // Use fakeAsync and tick to simulate async operations
    tick();
  
    const hexInBounds = new Set<string>(['hex1', 'hex2']);
    const hexDensities = new Map<string, number>([['hex1', 3], ['hex2', 5]]);
    spyOn(component, 'filterInBounds').and.returnValue(hexInBounds);
    spyOn(component, 'calculateHexagonDensity').and.returnValue(hexDensities);
    spyOn(component, 'displayHexagons');
  
    // Spy on the getBounds method and return the mock bounds
    spyOn(component.map, 'getBounds').and.returnValue(bounds);
  
    // Call the visualizeMap method
    component.visualizeMap();
  
    flush();
  
    // Assert the expectations
    const myBounds = component.map.getBounds();
    expect(myBounds).toEqual(bounds);
    expect(component.filterInBounds).toHaveBeenCalledWith(bounds);
    expect(component.calculateHexagonDensity).toHaveBeenCalledWith(component.poiPerHex);
    expect(component.displayHexagons).toHaveBeenCalledWith(hexInBounds, component.poiPerHex);
  }));

  it('should display hexagons', () => {

    spyOn(component, 'displaySmallHex');

    const poi: PointOfInterest = {
      id: '135892',
      type: RoadHazardType.Police,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId: '891eccb6ecbffff',
      status: 'Active',
      note: 'mock_note',
      userId: 'user1'
    };

    const poi2: PointOfInterest = {
      id: '12316176',
      type: RoadHazardType.Potholes,
      createdAt: new Date('2023-01-13T00:16:28.982Z'),
      hexId: '8e1ec0b2e3a0007',
      status: 'Active',
      note: 'mock_note',
      userId: 'user3'
    };
    const inp = new Map<string, PointOfInterest[]>();
    inp.set('891eccb6ecbffff', [poi]);
    inp.set('8e1ec0b2e3a0007', [poi2]);
        
    component.displayHexagons(new Set(['891eccb6ecbffff', '8e1ec0b2e3a0007']), inp);
    expect(component.displaySmallHex).toHaveBeenCalledWith('891eccb6ecbffff');
    expect(component.displaySmallHex).toHaveBeenCalledWith('8e1ec0b2e3a0007');
  });
  
  it('should display hexagons only for selected hazards', () => {
    spyOn(component, 'displayNormalHex');

    const poi1: PointOfInterest = {
      id: '135892',
      type: RoadHazardType.Police,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId: '891eccb6ecbffff',
      status: 'Active',
      note: 'mock_note',
      userId: 'user1'
    };
  
    const poi2: PointOfInterest = {
      id: '12316176',
      type: RoadHazardType.Potholes,
      createdAt: new Date('2023-01-13T00:16:28.982Z'),
      hexId: '8e1ec0b2e3a0007',
      status: 'Active',
      note: 'mock_note',
      userId: 'user3'
    };
  
    const poiMap = new Map<string, PointOfInterest[]>();
    const parentIds = [h3.cellToParent('891eccb6ecbffff', resolutionLevel), h3.cellToParent('8e1ec0b2e3a0007', resolutionLevel)];
    poiMap.set(parentIds[0], [poi1]);
    poiMap.set(parentIds[1], [poi2]);
    
    component.updateHazards(new Set([RoadHazardType.Potholes]));
    const fillOp = component.hexDensities.get(parentIds[0]) || 0;
  
    component.displayHexagons(new Set(parentIds), poiMap);
    expect(component.displayNormalHex).toHaveBeenCalledWith(parentIds[1], fillOp);
  });

  it('should display hexagons only for searched hex id', () => {
    spyOn(component, 'displaySearchedHex');

    const poi1: PointOfInterest = {
      id: '135892',
      type: RoadHazardType.Police,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId: '891eccb6ecbffff',
      status: 'Active',
      note: 'mock_note',
      userId: 'user1'
    };
  
    const poi2: PointOfInterest = {
      id: '12316176',
      type: RoadHazardType.Potholes,
      createdAt: new Date('2023-01-13T00:16:28.982Z'),
      hexId: '8e1ec0b2e3a0007',
      status: 'Active',
      note: 'mock_note',
      userId: 'user3'
    };
  
    const poiMap = new Map<string, PointOfInterest[]>();
    const parentIds = [h3.cellToParent('891eccb6ecbffff', resolutionLevel), h3.cellToParent('8e1ec0b2e3a0007', resolutionLevel)];
    poiMap.set(parentIds[0], [poi1]);
    poiMap.set(parentIds[1], [poi2]);
    
    component.updateHazards(new Set([RoadHazardType.Police]));
    component.searchHexIds = new Set([parentIds[0]]);
    const fillOp = component.hexDensities.get(parentIds[0]) || 0;
  
    component.displayHexagons(new Set(parentIds), poiMap);
    expect(component.displaySearchedHex).toHaveBeenCalledWith(parentIds[0], fillOp);
  });

  it('small hexagons should be displayed', () => {

    const hexId = '891eccb6ecbffff';
  
    component.displaySmallHex(hexId);
    expect(component.polygonIds).toEqual([hexId]);
    expect(component.displayedHexagons.size).toEqual(1);
  });

  it('searched hexagons should be displayed', () => {

    const hexId = '891eccb6ecbffff';
    const fillOp = component.hexDensities.get(hexId) || 0;

    component.displaySearchedHex(hexId, fillOp);
    expect(component.polygonIds).toEqual([hexId]);
    expect(component.displayedHexagons.size).toEqual(1);
  });

  it('hexagons should be displayed', () => {

    const hexId = '891eccb6ecbffff';
    const fillOp = component.hexDensities.get(hexId) || 0;

    component.displayNormalHex(hexId, fillOp);
    expect(component.polygonIds).toEqual([hexId]);
    expect(component.displayedHexagons.size).toEqual(1);
  });

});