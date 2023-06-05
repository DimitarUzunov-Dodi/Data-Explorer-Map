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
    if (this.chart != undefined){
      this.chart.destroy();
    }
    
    console.log("PieChart Hex: " + this.hexId)
    const dropdown = document.getElementById('myDropdown') as HTMLSelectElement;
    const getSelectedBtn = document.getElementById('getSelectedBtn');

    // @ts-ignore
    getSelectedBtn.addEventListener('click', () => {
      const selectedOption = dropdown.value;
      console.log(selectedOption)

      this.createChart(selectedOption);
    });

  }
  ngOnChanges(): void {
    this.ngOnInit();
  }
  createChart(hist: string){

    // button needs to be added for time period
    const tt = this.poiService.loadData(this.hexId,hist)
    // console.log(tt)
    if(tt.incCount == 0 && tt.cameraCount == 0 &&
      tt.policeCount == 0 && tt.potCount == 0 && tt.aqCount == 0
      && tt.fogCount == 0 && tt.trafficCount == 0 && tt.condCount == 0
      && tt.icyCount == 0 && tt.emergCount == 0){
      window.alert("No Data Available for This Period")

    }
    else{
      this.chart = new Chart("MyChart", {
        type: 'pie', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: ['Potholes', 'Fog','Aquaplaning','Icy Roads','Traffic','Emergencies', 'Traffic Conditions', 'Police', 'Cameras/Radars', 'Incidents'],
          datasets: [{
            label: 'Occurrences',
            data: [tt.potCount, tt.fogCount, tt.aqCount, tt.icyCount, tt.trafficCount, tt.emergCount, tt.condCount, tt.policeCount, tt.cameraCount, tt.incCount],
            backgroundColor: [
              'red',
              'pink',
              'green',
              'yellow',
              'orange',
              'blue',
              'black',
              'brown',
              'violet',
              'purple'
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

