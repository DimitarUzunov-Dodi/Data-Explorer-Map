import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiInfotainmentPanelComponent } from './poi-infotainment-panel.component';
import { HomepageComponent } from 'src/app/homepage/homepage.component';

describe('PoiInfotainmentPanelComponent', () => {
  let component: PoiInfotainmentPanelComponent;
  let fixture: ComponentFixture<PoiInfotainmentPanelComponent>;

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
