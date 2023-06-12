import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotainmentPanelComponent } from './infotainment-panel.component';
import { HomepageComponent } from '../homepage/homepage.component';

describe('InfotainmentPanelComponent', () => {
  let component: InfotainmentPanelComponent;
  let fixture: ComponentFixture<InfotainmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfotainmentPanelComponent ],
      providers: [HomepageComponent]
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
