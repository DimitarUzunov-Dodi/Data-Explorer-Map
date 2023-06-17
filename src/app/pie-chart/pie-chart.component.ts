import {Component, Input, OnChanges, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {PoiService} from "../Services/poi.service";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, OnChanges{

  /* eslint-disable */
  public chart: any;
  @Input() hexId: string = "";
  display: boolean = true;
  constructor(private poiService: PoiService) { }
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
  ngOnChanges(): void {
    if (this.chart != undefined){
      this.chart.destroy();
    }
  }
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

