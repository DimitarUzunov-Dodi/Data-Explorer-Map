import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiInfotainmentPanelComponent } from './poi-infotainment-panel.component';
import { HomepageComponent } from 'src/app/homepage/homepage.component';
import { PointOfInterest, RoadHazardType } from 'src/app/Services/models/poi';
import { PoiService } from 'src/app/Services/poi.service';

describe('PoiInfotainmentPanelComponent', () => {
  let component: PoiInfotainmentPanelComponent;
  let fixture: ComponentFixture<PoiInfotainmentPanelComponent>;
  let poiService: PoiService;
  let homepage: HomepageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoiInfotainmentPanelComponent ],
      providers: [HomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoiInfotainmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoiInfotainmentPanelComponent);
    component = fixture.componentInstance;
    poiService = TestBed.inject(PoiService);
    homepage = TestBed.inject(HomepageComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize the component', () => {
    const poiId = "135892";
    const poi: PointOfInterest = {
      id: "135892",
      type:  RoadHazardType.Police,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };
    const expDate = new Date(poi.createdAt);
    expDate.setDate(expDate.getDate() + 1);
    spyOn(poiService, 'getPoiArr').and.returnValue([poi]);
    spyOn(poiService, 'getExpDate').and.returnValue(expDate);
    component.selectedPoiId = poiId;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.poi).toEqual(poi);
    expect(poiService.getPoiArr).toHaveBeenCalled();
    expect(poiService.getExpDate).toHaveBeenCalledWith(poi);
  });

  it('should set the maximum resolution hexagon', () => {
    const poiId = 'poi1';
    const hexagons = [
      { hexId: 'hex1', resolution: 2 },
      { hexId: 'hex2', resolution: 3 },
    ];
    spyOn(poiService, 'getHexagonsByPoiId').and.returnValue(hexagons);
    component.selectedPoiId = poiId;
    component.getHexagons();
    fixture.detectChanges();
    expect(component.hexIdMaxRes).toEqual('hex2');
    expect(poiService.getHexagonsByPoiId).toHaveBeenCalledWith(poiId);
  });
  it('should enqueue and trigger search for hex infotainment', () => {
    const hexId = 'hex1';
    spyOn(homepage, 'enqueue');
    spyOn(homepage, 'handleSearchTriggered');
    component.openHexInfotainment(hexId);
    expect(homepage.enqueue).toHaveBeenCalledWith(['hex', hexId], homepage.past);
    expect(homepage.handleSearchTriggered).toHaveBeenCalledWith(['hex', hexId]);
  });
  it('should enqueue and trigger search for user infotainment', () => {
    const userId = 'user1';
    spyOn(homepage, 'enqueue');
    spyOn(homepage, 'handleSearchTriggered');
    component.openUserInfotainment(userId);
    expect(homepage.enqueue).toHaveBeenCalledWith(['user', userId], homepage.past);
    expect(homepage.handleSearchTriggered).toHaveBeenCalledWith(['user', userId]);
  });

  it('should set the status to "Expired" when the expiration date is in the past', () => {
    // Prepare mock data
    const poi: PointOfInterest = {
      id: "135892",
      type:  RoadHazardType.Police,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };
    const expDate = poi.createdAt;
    expDate.setDate(expDate.getDate() + 1);
    spyOn(poiService, 'getPoiArr').and.returnValue([poi]);
    spyOn(poiService, 'getExpDate').and.returnValue(expDate);

    // Set input values
    component.selectedPoiId = poi.id;
    component.ngOnInit();
    component.getStatus();

    fixture.detectChanges();

    // Check if the status is set to "Expired"
    expect(component.stat).toEqual('Expired');
  });

  it('should set the status to "Active" when the expiration date is in the future', () => {
    const poi: PointOfInterest = {
      id: "135892",
      type:  RoadHazardType.Police,
      createdAt: new Date(),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 1);
    spyOn(poiService, 'getPoiArr').and.returnValue([poi]);
    spyOn(poiService, 'getExpDate').and.returnValue(expDate);
    component.selectedPoiId = poi.id;
    component.ngOnInit();
    component.getStatus();
    fixture.detectChanges();
    expect(component.stat).toEqual('Active');
  });
});
