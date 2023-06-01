import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiInfotainmentPanelComponent } from './poi-infotainment-panel.component';

describe('PoiInfotainmentPanelComponent', () => {
  let component: PoiInfotainmentPanelComponent;
  let fixture: ComponentFixture<PoiInfotainmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoiInfotainmentPanelComponent ]
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
