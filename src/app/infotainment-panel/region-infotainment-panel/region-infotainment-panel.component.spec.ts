import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionInfotainmentPanelComponent } from './region-infotainment-panel.component';
import { HomepageComponent } from 'src/app/homepage/homepage.component';

describe('RegionInfotainmentPanelComponent', () => {
  let component: RegionInfotainmentPanelComponent;
  let fixture: ComponentFixture<RegionInfotainmentPanelComponent>;
  let homepage: HomepageComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionInfotainmentPanelComponent],
      providers: [
        HomepageComponent,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionInfotainmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    homepage = TestBed.inject(HomepageComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('openHexInfotainmentPanle', () => {
    spyOn(homepage, 'handleSearchTriggered');
    spyOn(homepage, 'enqueue');
    component.openHexInfotainment("1");
    expect(homepage.enqueue).toHaveBeenCalledWith(['hex', "1"], homepage.past);
    expect(homepage.handleSearchTriggered).toHaveBeenCalledWith(['hex', "1"]);
  });
});
