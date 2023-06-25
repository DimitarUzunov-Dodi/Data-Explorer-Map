import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { PoiService } from '../Services/poi.service';
import { PointOfInterest, RoadHazardType } from '../Services/models/poi';
import { ElementRef } from '@angular/core';
import { MAP_STYLES } from '../Services/models/mapStyle';
import * as h3 from 'h3-js';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let poiService: PoiService;
  let mockMapElement: ElementRef;

  beforeEach(async () => {
    mockMapElement = {
      nativeElement: document.createElement('div'),
    } as ElementRef;
    await TestBed.configureTestingModule({
      declarations: [MapComponent],
      providers: [HomepageComponent, PoiService]
    }).compileComponents();
  });

  beforeEach(() => {
    
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    component.mapElement = mockMapElement;
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

  //   //visualizeMap
  // it('visualizeMap', () => {
  //   const center = { lat: 37.7749, lng: -122.4194 };
  //   const zoom = 12;
  //   const mapOptions: google.maps.MapOptions = {
  //     mapTypeId: 'roadmap',
  //     backgroundColor: '#212121',
  //     styles: MAP_STYLES,
  //     disableDefaultUI: true,
  //     maxZoom: 20,
  //     minZoom: 1,
  //     restriction: {
  //       latLngBounds: {
  //         north: 85,
  //         south: -85,
  //         west: -180,
  //         east: 180,
  //       },
  //       strictBounds: true,
  //     },
  //   };
  //   component.map = new google.maps.Map(mockMapElement.nativeElement, {
  //     center: this.center,
  //     zoom: this.zoom,
  //     ...this.mapOptions
  //   });
  //   expect(component.map).toBeDefined();
  // });

  it('getCellBoundary should retrieve the boundary coordinates of a hexagon', () => {
    const hexId: string = '891eccb6ecbffff';
    const boundary: number[][] = component.getCellBoundary(hexId);
    expect(boundary).toBeDefined();
    expect(Array.isArray(boundary)).toBe(true);
  });

  it('getResolution should retrieve the resolution level of a hexagon', () => {
    const hexId: string = '891eccb6ecbffff';
    const resolution: number = component.getResolution(hexId);
    expect(resolution).toBeDefined();
    expect(typeof resolution).toBe('number');
  });

  it('processLowerResolutionHexagons should process lower resolution hexagons', () => {
    const hexId: string = '891eccb6ecbffff';
    component.processLowerResolutionHexagons(hexId);
    expect(component.searchHexIds).toContain('881eccb6edfffff')
  });

  it('processHigherResolutionHexagon should process a higher resolution hexagon', () => {
    const hexId: string = '881eccb401fffff';
    component.processHigherResolutionHexagon(hexId);
    expect(component.smallHexToDisplay).toContain('881eccb401fffff')
  });

  it('processSameResolutionHexagon should process a same resolution hexagon', () => {
    const hexId: string = '881eccb6edfffff';
    component.processSameResolutionHexagon(hexId);
    expect(component.searchHexIds).toContain('881eccb6edfffff')
  });

  it('calculateBounds should calculate the bounds based on hexagon coordinates', () => {
    const hexagonCoords: number[][] = [
      [40.7128, -74.0060], 
      [37.7749, -122.4194],
      [34.0522, -118.2437],
    ];
    const bounds = component.calculateBounds(hexagonCoords);

    // Perform assertions on the 'bounds' object to ensure it matches the expected result
    expect(bounds).toBeDefined();
    expect(bounds instanceof google.maps.LatLngBounds).toBe(true);
    
    const expectedBottomLeft = new google.maps.LatLng(-122.4194, 34.0522);
    const expectedTopRight = new google.maps.LatLng(-74.0060, 40.7128);

    expect(bounds.getSouthWest().lat()).toEqual(expectedBottomLeft.lat());
    expect(bounds.getSouthWest().lng()).toEqual(expectedBottomLeft.lng());
    expect(bounds.getNorthEast().lat()).toEqual(expectedTopRight.lat());
    expect(bounds.getNorthEast().lng()).toEqual(expectedTopRight.lng());
    expect(bounds.getNorthEast().equals(expectedTopRight)).toBe(true);
  });

  it('should return the hexagon ID associated with the provided POI ID', () => {
    // Create a mock of the getPoiArr method
    spyOn(poiService, 'getPoiArr').and.returnValue([
      { id: '1', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note1', userId: 'user1' },
      { id: '2', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note2', userId: 'user2' }
    ]);

    // Call the getSearchedHexFromPoiId method with a valid POI ID
    const hexId = component.getSearchedHexFromPoiId('1');

    // Verify that the hexId is the expected value
    expect(hexId).toEqual('hex1');
  });

  it('should throw an error if the POI is not found', () => {
    // Create a mock of the getPoiArr method
    spyOn(poiService, 'getPoiArr').and.returnValue([
      { id: '1', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note1', userId: 'user1' },
      { id: '2', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note2', userId: 'user2' }
    ]);

    // Call the getSearchedHexFromPoiId method with an invalid POI ID
    const invalidCall = () => component.getSearchedHexFromPoiId('3');

    // Verify that an error is thrown
    expect(invalidCall).toThrowError('POI not found');
  });

  it('calculateBoundsOfUser should calculate the bounds of the searched hexes correctly', () => {
    // Mock the getCellBoundary method
    spyOn(component, 'getCellBoundary').and.returnValues(
      [[10, 20], [11, 19]], // Hex 1 coordinates
      [[30, 40], [30, 39]]  // Hex 2 coordinates
    );

    // Define the searched hexes
    const searchedHexes = ['hex1', 'hex2'];

    // Call the calculateBoundsOfUser method
    const bounds = component.calculateBoundsOfUser(searchedHexes);

    // Verify the calculated bounds
    expect(bounds.maxLat).toBe(30);
    expect(bounds.minLat).toBe(10);
    expect(bounds.maxLng).toBe(40);
    expect(bounds.minLng).toBe(20);
  });

  it('getSearchedHexesFromUserId should retrieve the searched hexes associated with a user ID correctly', () => {
    // Mock the getPoiArr method
    spyOn(poiService, 'getPoiArr').and.returnValue([
      { id: '1', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note1', userId: 'user1' },
      { id: '2', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note2', userId: 'user2' },
      { id: '3', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex2', status: 'Active', note: 'Note1', userId: 'user1' },
  
    ]);

    // Define the user ID
    const userId = 'user1';

    // Call the getSearchedHexesFromUserId method
    const searchedHexes = component.getSearchedHexesFromUserId(userId);

    // Verify the retrieved searched hexes
    expect(searchedHexes).toEqual(['hex1', 'hex2']);
  });

  it('getSearchedHexesFromUserId should return an empty array when no searched hexes are associated with a user ID', () => {
    // Mock the getPoiArr method
    spyOn(poiService, 'getPoiArr').and.returnValue([
      { id: '1', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note1', userId: 'user1' },
      { id: '2', type: RoadHazardType.Police, createdAt: new Date(), hexId: 'hex1', status: 'Active', note: 'Note2', userId: 'user2' }
    ]);

    // Define a user ID with no associated searched hexes
    const userId = 'user3';

    // Call the getSearchedHexesFromUserId method
    const searchedHexes = component.getSearchedHexesFromUserId(userId);

    // Verify that an empty array is returned
    expect(searchedHexes).toEqual([]);
  });

  it('should convert the bounds values to LatLngBounds correctly', () => {
    const maxLat = 10;
    const minLat = 5;
    const maxLng = -75;
    const minLng = -80;

    const result = component.boundsToCoordinates(maxLat, minLat, maxLng, minLng);

    expect(result instanceof google.maps.LatLngBounds).toBe(true);
    expect(result.getNorthEast().lat()).toEqual(maxLng);
    expect(result.getSouthWest().lat()).toEqual(minLng);
    expect(result.getNorthEast().lng()).toEqual(maxLat);
    expect(result.getSouthWest().lng()).toEqual(minLat);
  });

  it('should transform hexagons to the specified resolution level correctly', () => {
    const searchUserHexIds: Set<string> = new Set<string>(['881eccb6edfffff', '881eccb401fffff', '891eccb6ecbffff']);
    const resolutionLevel = 8;

    const result = component.transformHexagonsToLevel(searchUserHexIds);

    expect(result instanceof Set).toBe(true);
    expect(result.size).toBeGreaterThan(0);

    for (const hexId of result) {
      const hexResolution = h3.getResolution(hexId);
      expect(hexResolution).toBe(resolutionLevel);
    }
  });
});

