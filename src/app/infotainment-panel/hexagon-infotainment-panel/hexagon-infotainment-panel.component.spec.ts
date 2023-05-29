import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel.component';

describe('HexagonInfotainmentPanelComponent', () => {
  let component: HexagonInfotainmentPanelComponent;
  let fixture: ComponentFixture<HexagonInfotainmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexagonInfotainmentPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HexagonInfotainmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
