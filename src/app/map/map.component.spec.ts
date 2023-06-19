import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { PoiService } from '../Services/poi.service';
import { PointOfInterest, RoadHazardType } from '../Services/models/poi';

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
  });

  beforeEach(() => {
    // Mock the Google Maps API
    (window as any).google = {
      maps: {
        Map: jasmine.createSpy('Map'),
        event: {
          addListener: jasmine.createSpy('addListener')
        }
      }
    };
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load and process data from JSON file during initialization', async () => {
    const poi: PointOfInterest = {
      id: "135892",
      type:  RoadHazardType.Police,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };
    const inp = new Map<string, PointOfInterest[]>();
    inp.set("891eccb6ecbffff", [poi])

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

  it('should load map with current center', () => {
  });

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
    expect(component.center).toEqual({ lat: 40.712776, lng: -74.005974 });
    expect(component.initializeMap).toHaveBeenCalled();
  });

  it('should initialize the map without current position if geolocation permission is denied', () => {
    const mockError: GeolocationPositionError = {
      code: 1,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3 // Use the appropriate constant value based on your test case
      ,
      message: ''
    };

    spyOn(navigator.geolocation, 'getCurrentPosition')
      .and.callFake((successCallback: PositionCallback, errorCallback: PositionErrorCallback) => {
        errorCallback(mockError);
      });

    spyOn(component, 'initializeMap');

    component.ngAfterViewInit();

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    expect(component.center).toEqual({ lat: 37.7749, lng: -122.4194 });
    expect(component.initializeMap).toHaveBeenCalled();
  });


});