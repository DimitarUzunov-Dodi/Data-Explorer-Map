import {Component, Input, OnChanges, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {PoiService} from "../Services/poi.service";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})


/**
 * The PieChartComponent is an Angular component for displaying a pie chart of road hazard
 * occurrences based on the selected time period and hexId.
 * The chart is rendered using the Chart.js library.
 */
export class PieChartComponent implements OnInit, OnChanges{

  /* eslint-disable */
  /**
   * Stores the chart object instance. It is initialized to any type.
   */
  public chart: any;

  /**
   * An Input decorated property that sets the hexId used to fetch the POI data.
   * This value is expected to be passed by the parent component.
   */
  @Input() hexId: string = "";

  /**
   * A boolean flag to control the display state of the chart.
   */
  display: boolean = true;
  constructor(private poiService: PoiService) { }

  /**
   * This lifecycle hook method is called after Angular initializes the component's input properties.
   * It sets the chart default properties and attaches a click event listener to the 'getSelectedBtn' element,
   * which triggers the createChart() method with the selected option from the dropdown menu.
   */
  ngOnInit(): void {
    Chart.defaults.font.family = "Arial"
    Chart.defaults.color = "#fff"

    if (this.chart != undefined){
      this.chart.destroy();
    }

    const dropdown = document.getElementById('myDropdown') as HTMLSelectElement;
    const getSelectedBtn = document.getElementById('getSelectedBtn');

    // @ts-ignore
    getSelectedBtn.addEventListener('click', () => {
      const selectedOption = dropdown.value;

      this.createChart(selectedOption);
    });

  }

  /**
   * This lifecycle hook method is called when Angular detects changes
   * to input properties of the component.
   * If a chart already exists, it gets destroyed to allow
   * for the creation of a new one when an input property changes.
   */
  ngOnChanges(): void {
    if (this.chart != undefined){
      this.chart.destroy();
    }
  }

  /**
   * This method uses the loadData() method of poiService to get the road hazard data
   * for a given hexId and time period. It creates a new pie chart with the fetched data.
   * If there's no data available for the given time period, it shows an alert message.
   * @param hist
   */
  createChart(hist: string){

    // button needs to be added for time period
    const tt = this.poiService.loadData(this.hexId,hist)
    if(tt.incCount == 0 && tt.cameraCount == 0 &&
      tt.policeCount == 0 && tt.potCount == 0 && tt.aqCount == 0
      && tt.fogCount == 0 && tt.trafficJamsCount == 0 && tt.condCount == 0
      && tt.icyCount == 0 && tt.emergCount == 0){
      window.alert("No Data Available for This Period")

    }
    else{
      this.chart = new Chart("MyChart", {
        type: 'pie', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: ['Potholes', 'Fog','Aquaplaning','Icy Roads','Traffic Jams','Emergencies', 'Road Conditions', 'Police', 'Cameras/Radars', 'Incidents'],
          datasets: [{
            label: 'Occurrences',
            data: [tt.potCount, tt.fogCount, tt.aqCount, tt.icyCount, tt.trafficJamsCount, tt.emergCount, tt.condCount, tt.policeCount, tt.cameraCount, tt.incCount],
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
    }

  }
}

