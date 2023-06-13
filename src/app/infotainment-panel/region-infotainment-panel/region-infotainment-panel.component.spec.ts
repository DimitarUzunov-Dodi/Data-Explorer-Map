import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionInfotainmentPanelComponent } from './region-infotainment-panel.component';
import { HomepageComponent } from 'src/app/homepage/homepage.component';

describe('RegionInfotainmentPanelComponent', () => {
  let component: RegionInfotainmentPanelComponent;
  let fixture: ComponentFixture<RegionInfotainmentPanelComponent>;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
