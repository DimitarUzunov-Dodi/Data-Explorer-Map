import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionInfotainmentPanelComponent } from './region-infotainment-panel.component';
import { MapComponent } from 'src/app/map/map.component';
describe('RegionInfotainmentPanelComponent', () => {
  let component: RegionInfotainmentPanelComponent;
  let fixture: ComponentFixture<RegionInfotainmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionInfotainmentPanelComponent],
      providers: [MapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionInfotainmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
