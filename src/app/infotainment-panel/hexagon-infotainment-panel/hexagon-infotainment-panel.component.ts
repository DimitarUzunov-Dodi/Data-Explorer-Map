import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as h3 from 'h3-js';
import { PoiService } from 'src/app/Services/poi.service';
import { PointOfInterest } from 'src/app/Services/models/poi';
import { ResolutionLevel } from 'src/app/Services/models/mapModels';

@Component({
  selector: 'app-hexagon-infotainment-panel',
  templateUrl: './hexagon-infotainment-panel.component.html',
  styleUrls: ['./hexagon-infotainment-panel.component.css']
})
export class HexagonInfotainmentPanelComponent implements OnChanges{
  @Input() showInfotainmentPanel = false;
  @Input() searchedHex = '';
  parentHexId = '';
  area = 0;
  countries: string[] = [];
  weatherIcon = '';
  weatherDescription = '';
  minTemp = "0";
  maxTemp = "0";
  feelsLikes = "0";
  windspeed = "0";
  rain: number | string = 0;
  constructor(private http: HttpClient, private poiService: PoiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedHex'] && !changes['searchedHex'].firstChange) {
      this.ngOnInit();
    }
  }
  async ngOnInit(): Promise<void> {
    try {
      this.calculateParentHexId();
      this.calculateArea();
      this.fetchPois();
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
    if (resoulution==1){
      this.parentHexId="The selected hex has no parent."
    }
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

  /* eslint-disable */
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
        this.rain = weatherResponse.rain? weatherResponse.rain?.['1h'] + " mm" : "Unavailable";
        return response;
      } else {
        throw new Error('Failed to fetch weather forecast');
      }
    } catch (error) {
      throw new Error('Failed to fetch weather forecast');
    }
  }
  /* eslint-enable */

  showPoiData = false;

  openPoiData() {
    this.showPoiData =  !this.showPoiData ;
  }
  
  poiPanel = false;
  openPoiInfotainment() {
    this.poiPanel = true ;
  }

  showUserInfotainment =false;

  openUserInfotainment(){
    this.showUserInfotainment=!this.showUserInfotainment;
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

  pois: PointOfInterest[] = [];

  fetchPois(): void {
    this.pois = this.poiService.getPoIsByHexId(this.searchedHex)
  }
  
}

