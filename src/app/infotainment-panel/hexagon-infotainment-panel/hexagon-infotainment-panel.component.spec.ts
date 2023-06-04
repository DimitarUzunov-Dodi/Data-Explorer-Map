import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PieChartComponent} from "src/app/pie-chart/pie-chart.component";
import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel.component';
import { HomepageComponent } from 'src/app/homepage/homepage.component';

describe('HexagonInfotainmentPanelComponent', () => {
  let component: HexagonInfotainmentPanelComponent;
  let fixture: ComponentFixture<HexagonInfotainmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexagonInfotainmentPanelComponent, PieChartComponent ],
      imports: [HttpClientTestingModule],
      providers: [HomepageComponent], 
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
