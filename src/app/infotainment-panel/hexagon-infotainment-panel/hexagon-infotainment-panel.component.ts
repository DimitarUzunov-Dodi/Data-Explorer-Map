import { Component, Input, OnChanges, SimpleChanges,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as h3 from 'h3-js';
import { PoiInfotainmentPanelComponent } from '../poi-infotainment-panel/poi-infotainment-panel.component';

@Component({
  selector: 'app-hexagon-infotainment-panel',
  templateUrl: './hexagon-infotainment-panel.component.html',
  styleUrls: ['./hexagon-infotainment-panel.component.css']
})
export class HexagonInfotainmentPanelComponent implements OnChanges{
 // @(PoiInfotainmentPanelComponent) currentPanel!: PoiInfotainmentPanelComponent;
  @Input() showInfotainmentPanel: boolean = false;
  @Input() searchedHex: string = '';
  parentHexId: string = '';
  area: number = 0;
  countries: string[] = [];
  weatherIcon: string = '';
  weatherDescription: string = '';
  minTemp: number = 0;
  maxTemp: number = 0;
  feelsLikes: number = 0;
  windspeed: number = 0;
  rain: number = 0;
  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedHex'] && !changes['searchedHex'].firstChange) {
      this.ngOnInit();
    }
  }
  async ngOnInit(): Promise<void> {
    try {
      this.calculateParentHexId();
      this.calculateArea();
      const geocodingPromise = this.getCountries()
      const countries: string[] = await geocodingPromise;
      this.countries = [...new Set(countries)];
      await this.getWeatherForecast();
    } catch (error) {
      console.error(error);
    }
  }

  calculateParentHexId(): void {
    const resoulution = h3.getResolution(this.searchedHex);
    if(resoulution!=-1){
      this.parentHexId=  h3.cellToParent(this.searchedHex, resoulution-1);
    }
  }

  calculateArea():void{
    const areaMeters = (h3.cellArea(this.searchedHex, 'km2')).toFixed(3);
    this.area =+areaMeters;

  }

  async getCountries(): Promise<string[]> {
    try {
      const newHexagonIds = h3.cellToChildren(this.searchedHex, h3.getResolution(this.searchedHex) + 2);
      const geocoder = new google.maps.Geocoder();
      const geocodingRequests = newHexagonIds.map(newHexId => {
        const hexagonCoords = h3.cellToBoundary(newHexId, true);
        return {
          location: new google.maps.LatLng(hexagonCoords[0][1], hexagonCoords[0][0])
        };
      });
  
      const countryNamesArrays: string[][] = [];
      for (const request of geocodingRequests) {
        try {
          const countryNames: string[] = await new Promise<string[]>((resolve, reject) => {
            geocoder.geocode(request, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                const names: string[] = results.map(result =>
                  result.address_components.find(component =>
                    component.types.includes('country')
                  )?.long_name as string
                ).filter(Boolean);
                resolve(names);
              } else {
                reject(new Error('Reverse geocoding failed'));
              }
            });
          });
          countryNamesArrays.push(countryNames);
        } catch (error) {
          console.error('Error occurred during geocoding:', error);
        }
      }
  
      const countryNames: string[] = countryNamesArrays.flat();
      return countryNames;
    } catch (error) {
      throw new Error('Hexagon not found');
    }
  }

  async getWeatherForecast(): Promise<any> {
    const coords = h3.cellToLatLng(this.searchedHex)
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=61179205d75402bec9bf8541e2a2846b`;
    try {
      const response = await this.http.get(apiUrl).toPromise();
      if (response && response.hasOwnProperty('weather') && response.hasOwnProperty('main') && response.hasOwnProperty('wind')) {
        const weatherResponse = response as {
          weather: { icon: string; description: string }[];
          main: { temp_min: number; temp_max: number; feels_like: number };
          wind: { speed: number };
          rain?: { '1h': number };
        };
        this.weatherIcon = weatherResponse .weather[0].icon
        this.weatherDescription = weatherResponse .weather[0].description
        this.minTemp = weatherResponse.main.temp_min
        this.maxTemp = weatherResponse.main.temp_max
        this.feelsLikes = weatherResponse.main.feels_like
        this.windspeed = weatherResponse.wind.speed
        this.rain = weatherResponse.rain? weatherResponse.rain?.['1h'] : 0;
        return response;
      } else {
        throw new Error('Failed to fetch weather forecast');
      }
    } catch (error) {
      throw new Error('Failed to fetch weather forecast');
    }
  }

  showPOIsInfotainment = false;

  openPOIsInfotainment() {
    

    this.showPOIsInfotainment =  !this.showPOIsInfotainment ;

  }
}

