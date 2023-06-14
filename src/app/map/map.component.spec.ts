import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { HomepageComponent } from '../homepage/homepage.component';


describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapComponent],
      providers: [HomepageComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the correct initial map center', () => {
    const defaultCenter = { lat: 37.7749, lng: -122.4194 };
    expect(component.center).toEqual(defaultCenter);
  });

  it('should set the correct initial zoom level', () => {
    const defaultZoom = 12;
    expect(component.zoom).toEqual(defaultZoom);
  });

  it('should initialize the displayedHexagons map', () => {
    expect(component.displayedHexagons).toBeDefined();
    expect(component.displayedHexagons.size).toBe(0);
  });

  it('should initialize the poiPerHex map', () => {
    expect(component.poiPerHex).toBeDefined();
    expect(component.poiPerHex.size).toBe(0);
  });

  it('should initialize the searchedHazards set', () => {
    expect(component.searchedHazards).toBeDefined();
    expect(component.searchedHazards.size).toBeGreaterThan(0);
  });

  it('should initialize the searchHexIds set', () => {
    expect(component.searchHexIds).toBeDefined();
    expect(component.searchHexIds.size).toBe(0);
  });

  it('should initialize the searchUserHexIds set', () => {
    expect(component.searchUserHexIds).toBeDefined();
    expect(component.searchUserHexIds.size).toBe(0);
  });

  it('should initialize the smallHexToDisplay set', () => {
    expect(component.smallHexToDisplay).toBeDefined();
    expect(component.smallHexToDisplay.size).toBe(0);
  });

  it('should initialize the hexagonIds set', () => {
    expect(component.hexagonIds).toBeDefined();
    expect(component.hexagonIds.size).toBe(0);
  });

  it('should initialize the polygonIds array', () => {
    expect(component.polygonIds).toBeDefined();
    expect(Array.isArray(component.polygonIds)).toBeTruthy();
    expect(component.polygonIds.length).toBe(0);
  });

  // Add more tests as needed

});