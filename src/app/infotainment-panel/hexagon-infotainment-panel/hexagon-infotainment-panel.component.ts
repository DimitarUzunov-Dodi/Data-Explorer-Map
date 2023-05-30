import { Component, Input } from '@angular/core';
import * as h3 from 'h3-js';

@Component({
  selector: 'app-hexagon-infotainment-panel',
  templateUrl: './hexagon-infotainment-panel.component.html',
  styleUrls: ['./hexagon-infotainment-panel.component.css']
})
export class HexagonInfotainmentPanelComponent {
  @Input() showInfotainmentPanel: boolean = false;
  @Input() searchedHex: string = '';
  parentHexId: string = '';
  area: number = 0;
  countries: string[] = [];

  async ngOnInit(): Promise<void> {
    this.calculateParentHexId();
    this.calculateArea();

    const geocodingPromise = this.getCountries(this.searchedHex)
    const countries: string[] = await geocodingPromise;
    this.countries = [...new Set(countries)];
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



  async getCountries(hexagonId: string): Promise<string[]> {
    try {
      const newHexagonIds = h3.cellToChildren(hexagonId, h3.getResolution(hexagonId) + 2);
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
}