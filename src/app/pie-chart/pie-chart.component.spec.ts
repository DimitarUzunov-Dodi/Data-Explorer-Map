import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartComponent } from './pie-chart.component';
import { PoiService } from '../Services/poi.service';
import { ChartModel } from '../Services/models/chartModel';
import { Chart } from 'chart.js';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;
  let poiService: PoiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieChartComponent],
      providers: [PoiService]
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    poiService = TestBed.inject(PoiService);
    fixture.detectChanges();
    if (component.chart != undefined){
      component.chart.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //createChart
  it('should call createChart method with selected option', () => {
    spyOn(poiService, 'loadData').and.returnValue(new ChartModel(1,2,4,0,1,0,0,0,1,1));
    if (component.chart != undefined){
      component.chart.destroy();
    }
    component.createChart("week")
    expect(component.chart.data.datasets).toEqual([{
          label: 'Occurrences',
          data: [1,2,4,0,1,0,0,0,1,1],
          backgroundColor: [
            '#1E313A',
            '#577D86',
            '#4C6361',
            '#7DA19D',
            '#658C77',
            '#A8CDBB',
            '#5E6769',
            '#A3B2AD',
            '#909D95',
            '#B2A89C'
          ],
          hoverOffset: 4
        }])
  });

  it('should display "No Data Available" alert when no data is available', () => {
    spyOn(poiService, 'loadData').and.returnValue(new ChartModel(0,0,0,0,0,0,0,0,0,0));
    component.createChart("week")
    expect(component.chart).toEqual(undefined);
  });


  // ngOnInit
  it('should initialize default properties and attach click event listener', () => {
    spyOn(component, 'createChart');
    const dropdown = document.createElement('select');
    dropdown.id = 'myDropdown';
    dropdown.value = 'week'
    const getSelectedBtn = document.createElement('button');
    getSelectedBtn.id = 'getSelectedBtn';
    getSelectedBtn.addEventListener('click', () => {
      const selectedOption = dropdown.value;
      component.createChart(selectedOption);
    });

    document.body.appendChild(dropdown);
    document.body.appendChild(getSelectedBtn);

    component.ngOnInit();

    expect(Chart.defaults.font.family).toBe('Arial');
    expect(Chart.defaults.color).toBe('#fff');
    expect(getSelectedBtn).toBeTruthy();
    getSelectedBtn.dispatchEvent(new Event('click'));
    expect(component.createChart).toHaveBeenCalledTimes(1);

    document.body.removeChild(dropdown);
    document.body.removeChild(getSelectedBtn);
  });


  // ngOnChanges
  it('should destroy existing chart when input properties change', () => {
    
    component.chart = new Chart("MyChart", {
        type: 'pie', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: ['Potholes', 'Fog','Aquaplaning','Icy Roads','Traffic Jams','Emergencies', 'Road Conditions', 'Police', 'Cameras/Radars', 'Incidents'],
          datasets: [{
            label: 'Occurrences',
            data: [1, 0, 0, 1, 2, 1, 0, 0, 0, 1],
            backgroundColor: [
              '#1E313A',
              '#577D86',
              '#4C6361',
              '#7DA19D',
              '#658C77',
              '#A8CDBB',
              '#5E6769',
              '#A3B2AD',
              '#909D95',
              '#B2A89C'
            ],
            hoverOffset: 4
          }],
        },
        options: {
        }

      });
    const destroySpy = spyOn(component.chart, 'destroy');
    component.ngOnChanges();

    expect(destroySpy).toHaveBeenCalled();
  });
});
