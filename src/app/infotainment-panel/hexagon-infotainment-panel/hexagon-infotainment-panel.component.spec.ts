import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PieChartComponent} from "src/app/pie-chart/pie-chart.component";
import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel.component';
import { HomepageComponent } from 'src/app/homepage/homepage.component';
import { PoiService } from 'src/app/Services/poi.service';
import { PointOfInterest, RoadHazardType } from 'src/app/Services/models/poi';
import { SimpleChange } from '@angular/core';
import * as h3 from 'h3-js';
describe('HexagonInfotainmentPanelComponent', () => {
  let component: HexagonInfotainmentPanelComponent;
  let fixture: ComponentFixture<HexagonInfotainmentPanelComponent>;
  let poiService: PoiService;
  let homepage: HomepageComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexagonInfotainmentPanelComponent, PieChartComponent ],
      imports: [HttpClientTestingModule],
      providers: [HomepageComponent, PoiService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HexagonInfotainmentPanelComponent);
    component = fixture.componentInstance;
    poiService = TestBed.inject(PoiService);
    homepage = TestBed.inject(HomepageComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', async () => {
    component.searchedHex = '891eccb6ecbffff';
    const areaSpy = spyOn(component, "calculateArea");
    const countriesSpy = spyOn(component, "getCountries");
    const weatherSpy = spyOn(component, "getWeatherForecast");
    await component.ngOnInit();
    expect(areaSpy).toHaveBeenCalled();
    const poi: PointOfInterest = {
      id: "135892",
      type:  RoadHazardType.Police,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };
    spyOn(poiService, "getPoIsByHexId").and.returnValue([poi]);
    expect(countriesSpy).toHaveBeenCalled();
    expect(weatherSpy).toHaveBeenCalled();
  });

  it('ngOnChanges', () => {
    component.searchedHex = '1';
    const spy = spyOn(component, 'ngOnInit');
    const changes = {
      searchedHex: {
        currentValue: '2',
        firstChange: false,
        previousValue: '1',
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(spy).toHaveBeenCalled();
  });

  it('calculateArea', () => {
    component.searchedHex = '891ec13b187ffff';
    component.calculateArea();
    expect(component.area).toEqual(0.116)
  });

  it('openPoiInfotainment', () => {
    const poiID = '1';
    spyOn(homepage, 'enqueue');
    spyOn(homepage, 'handleSearchTriggered');
    component.openPoiInfotainment(poiID);
    expect(homepage.enqueue).toHaveBeenCalledWith(['poi', poiID], homepage.past);
    expect(homepage.handleSearchTriggered).toHaveBeenCalledWith(['poi', poiID]);
  });

  it('openUserInfotainment', () => {
    const userId = 'user1';
    spyOn(homepage, 'enqueue');
    spyOn(homepage, 'handleSearchTriggered');
    component.openUserInfotainment(userId);
    expect(homepage.enqueue).toHaveBeenCalledWith(['user', userId], homepage.past);
    expect(homepage.handleSearchTriggered).toHaveBeenCalledWith(['user', userId]);
  });

  it('openPoiData', () => {
    component.showPoiData = true;
    expect(component.showPoiData).toBeTruthy();
    component.openPoiData();
    expect(component.showPoiData).toBeFalsy();
    component.openPoiData();
    expect(component.showPoiData).toBeTruthy();
  });

  it('convertToCelcius', () => {
    const res = component.convertToCelcius(273.15);
    expect(res).toEqual("0 °C")
  })
});