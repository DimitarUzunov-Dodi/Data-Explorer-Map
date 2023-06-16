import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfotainmentPanelComponent } from './user-infotainment-panel.component';
import {HomepageComponent} from "../../homepage/homepage.component";
import { PoiService } from 'src/app/Services/poi.service';
import { PointOfInterest, RoadHazardType } from 'src/app/Services/models/poi';

describe('UserInfotainmentPanelComponent', () => {
  let component: UserInfotainmentPanelComponent;
  let fixture: ComponentFixture<UserInfotainmentPanelComponent>;
  let poiService: PoiService;
  let homepage: HomepageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInfotainmentPanelComponent ],
      providers: [PoiService, HomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInfotainmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfotainmentPanelComponent);
    component = fixture.componentInstance;
    poiService = TestBed.inject(PoiService);
    homepage = TestBed.inject(HomepageComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and populate user POIs on initialization', () => {
    // Mock data
    const userId = 'user1';
    const userPois: PointOfInterest[] = [
      {
        id: "135892",
        type:  RoadHazardType.Police,
        createdAt: new Date('2016-11-04T16:57:11.718Z'),
        hexId : "891eccb6ecbffff",
        status: "Active",
        note : "mock_note",
        userId: 'user1'
      },
      {
        id: "135893",
        type:  RoadHazardType.Fog,
        createdAt: new Date('2016-11-04T16:57:11.718Z'),
        hexId : "891eccb6ecbffff",
        status: "Active",
        note : "mock_note",
        userId: 'user1'
      }
     
    ];

    spyOn(poiService, 'getUserPOIs').and.returnValue(userPois);

    component.userId = userId;
    component.ngOnInit();
    expect(component.pois).toEqual(userPois);
    expect(poiService.getUserPOIs).toHaveBeenCalledWith(userId);
  });

  it('should call homepage handleSearchTriggered method when opening POI infotainment', () => {
    const poiId = '135892';
    spyOn(homepage, 'handleSearchTriggered');
    component.openPoiInfotainment(poiId);
    expect(homepage.handleSearchTriggered).toHaveBeenCalledWith(['poi', poiId]);
  });
});
