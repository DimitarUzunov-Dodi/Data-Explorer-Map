import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel.component';

describe('HexagonInfotainmentPanelComponent', () => {
  let component: HexagonInfotainmentPanelComponent;
  let fixture: ComponentFixture<HexagonInfotainmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexagonInfotainmentPanelComponent ],
      imports: [HttpClientTestingModule], 
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
