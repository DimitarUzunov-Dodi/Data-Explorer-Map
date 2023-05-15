import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotainmentPanelComponent } from './infotainment-panel.component';

describe('InfotainmentPanelComponent', () => {
  let component: InfotainmentPanelComponent;
  let fixture: ComponentFixture<InfotainmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfotainmentPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfotainmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
