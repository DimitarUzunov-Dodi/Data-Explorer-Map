import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as h3 from 'h3-js';
import { PoiService } from 'src/app/Services/poi.service';
import { PointOfInterest } from 'src/app/Services/models/poi';
import { HomepageComponent } from 'src/app/homepage/homepage.component';
import { resolutionLevel } from 'src/app/Services/models/mapModels';
@Component({
  selector: 'app-hexagon-infotainment-panel',
  templateUrl: './hexagon-infotainment-panel.component.html',
  styleUrls: ['./hexagon-infotainment-panel.component.css']
})
export class HexagonInfotainmentPanelComponent implements OnChanges{
  @Input() showInfotainmentPanel = false;
  @Input() searchedHex = '';
  area = 0;
  countries: string[] = [];
  weatherIcon = '';
  weatherDescription = '';
  minTemp = "0";
  maxTemp = "0";
  feelsLikes = "0";
  windspeed = "0";
  rain: number | string = 0;
  pois: PointOfInterest[] = [];
  showPoiData = false;
  constructor(private http: HttpClient, private poiService: PoiService, private homepage: HomepageComponent) {}

   /**
   * Lifecycle hook that is called when any of the input properties change.
   * Used to trigger a refresh of data when the searched hexagon changes.
   * @param changes An object containing the changed input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedHex'] && !changes['searchedHex'].firstChange) {
      this.ngOnInit();
    }
  }

   /**
   * Lifecycle hook that is called after the component has been initialized.
   * Used to fetch necessary data and perform initialization tasks, 
   * including calls for other methods to initialize parent hex id, area, points 
   * of interest, coutries, weather.
   */
  async ngOnInit(): Promise<void> {
    try {
      this.calculateArea();
      this.pois = this.poiService.getPoIsByHexId(this.searchedHex)
      const geocodingPromise = this.getCountries()
      const countries: string[] = await geocodingPromise;
      this.countries = [...new Set(countries)];
      await this.getWeatherForecast();
    } catch (error) {
      console.error(error);
    }
  }
  

   /**
   * Calculates the area of the hexagon in square kilometers.
   */
  calculateArea():void{
    const areaMeters = (h3.cellArea(this.searchedHex, 'km2')).toFixed(3);
    this.area =+areaMeters;

  }

  /**
   * Retrieves the countries associated with the hexagon by performing reverse geocoding.
   * @returns A Promise that resolves to an array of country names.
   * @throws Error if the hexagon is not found or if reverse geocoding fails.
   */
  async getCountries(): Promise<string[]> {
    try {
      const newHexagonIds = h3.cellToChildren(this.searchedHex, h3.getResolution(this.searchedHex) + 1);
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

  /**
   * Retrieves the weather forecast for the hexagon's coordinates.
   * @returns A Promise that resolves to the weather forecast response.
   * @throws Error if failed to fetch the weather forecast.
   */
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
        this.minTemp = "Minimum temperature: " + this.convertToCelcius(weatherResponse.main.temp_min)
        this.maxTemp = "Maximum temperature: " + this.convertToCelcius(weatherResponse.main.temp_max)
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

  /**
   * Toggles the visibility of the POI data in the infotainment panel.
   */
  openPoiData(): void {
    this.showPoiData = !this.showPoiData;
  }

  /**
   * Opens the infotainment panel for the selected POI.
   * @param poiId The ID of the selected POI.
   */
  openPoiInfotainment(poiId: string): void {
    this.homepage.enqueue(['poi', poiId], this.homepage.past);
    this.homepage.handleSearchTriggered(['poi', poiId]);
  }

  /**
   * Opens the infotainment panel for the user.
   * @param userId The ID of the user.
   */
  openUserInfotainment(userId: string): void {
    this.homepage.enqueue(['user', userId], this.homepage.past);
    this.homepage.handleSearchTriggered(['user', userId]);
  }

  /**
   * Converts temperature from Kelvin to Celsius.
   * @param temp The temperature in Kelvin.
   * @returns The temperature in Celsius.
   */
  convertToCelcius(temp: number): string {
    return (temp - 273.15).toFixed(0) + ' °C';
  }
}


