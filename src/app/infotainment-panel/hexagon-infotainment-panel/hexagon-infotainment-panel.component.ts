import { Component, Input, OnChanges, SimpleChanges,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as h3 from 'h3-js';

@Component({
  selector: 'app-hexagon-infotainment-panel',
  templateUrl: './hexagon-infotainment-panel.component.html',
  styleUrls: ['./hexagon-infotainment-panel.component.css']
})
export class HexagonInfotainmentPanelComponent implements OnChanges{
  @Input() showInfotainmentPanel: boolean = false;
  @Input() searchedHex: string = '';
  parentHexId: string = '';
  area: number = 0;
  countries: string[] = [];
  weatherIcon: string = '';
  weatherDescription: string = '';
  minTemp: string = "0";
  maxTemp: string = "0";
  feelsLikes: string = "0";
  windspeed: string = "0";
  rain: number | string = 0;
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
       const res = this.findClosestResolutionLevel(resoulution-1)
      this.parentHexId=  h3.cellToParent(this.searchedHex,res);
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
      const geocodingPromises = geocodingRequests.map(request => {
        return new Promise<string[]>((resolve, reject) => {
          geocoder.geocode(request, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
              const countryNames: string[] = results.map(result =>
                result.address_components.find(component =>
                  component.types.includes('country')
                )?.long_name as string
              ).filter(Boolean);
              resolve(countryNames);
            } else {
              reject(new Error('Reverse geocoding failed'));
            }
          });
        });
      });
      const countryNamesArrays: string[][] = await Promise.all(geocodingPromises);
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
      console.log(response)
      if (response && response.hasOwnProperty('weather') && response.hasOwnProperty('main') && response.hasOwnProperty('wind')) {
        console.log("enters")
        const weatherResponse = response as {
          weather: { icon: string; description: string }[];
          main: { temp_min: number; temp_max: number; feels_like: number };
          wind: { speed: number };
          rain?: { '1h': number };
        };
        this.weatherIcon = weatherResponse .weather[0].icon
        this.weatherDescription = weatherResponse .weather[0].description
        this.minTemp = "Minimum temperatur: " + this.convertToCelcius(weatherResponse.main.temp_min)
        this.maxTemp = "Maximum temperatur: " + this.convertToCelcius(weatherResponse.main.temp_max)
        this.feelsLikes ="Feels like: " +  this.convertToCelcius(weatherResponse.main.feels_like)
        this.windspeed = "Wind speed: " + weatherResponse.wind.speed.toFixed(0) + " meter/sec"
        this.rain = weatherResponse.rain? weatherResponse.rain?.['1h'] : "Unavailable";
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

  findClosestResolutionLevel(target: number): ResolutionLevel {
    let closestResolution: ResolutionLevel = ResolutionLevel.CountryLevel;
    let closestDifference: number = Math.abs(target - closestResolution);
  
    for (const resolutionLevel in ResolutionLevel) {
      if (isNaN(Number(resolutionLevel))) {
        const resolutionValue = ResolutionLevel[resolutionLevel] as unknown as number;
        const difference = Math.abs(target - resolutionValue);
  
        if (difference < closestDifference) {
          closestDifference = difference;
          closestResolution = resolutionValue;
        }
      }
    }
  
    return closestResolution;
  }
  
  convertToCelcius(temp: number): string {
    return (temp - 273.15).toFixed(0) + " °C";
  }
  
}
enum ResolutionLevel {
  CountryLevel = 1,
  StateLevel = 3,
  CityLevel = 5,
  TownLevel = 7,
  RoadLevel = 9,
  RoadwayLevel = 11
}

