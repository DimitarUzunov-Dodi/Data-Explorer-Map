import {  Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef, EventEmitter, Output } from '@angular/core';
import * as h3 from 'h3-js';
import {PoiService} from "src/app/Services/poi.service";
import { PointOfInterest, RoadHazardType } from 'src/app/Services/models/poi';
import { resolutionLevel } from '../Services/models/mapModels';
import { SearchFunction } from '../Services/models/searchModels'
import { GoogleMapsModule } from '@angular/google-maps';
import { HomepageComponent } from '../homepage/homepage.component';
import {ChartModel} from "../Services/models/chartModel";
import { MAP_STYLES } from '../Services/models/mapStyle';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;
  map!: google.maps.Map;
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };
  zoom = 12;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    backgroundColor: '#212121',
    styles: MAP_STYLES,
    disableDefaultUI: true,
    maxZoom: 20,
    minZoom: 1,
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -180,
        east: 180
      },
      strictBounds: true
    }
  };

  displayedHexagons: Map<string, google.maps.Polygon> = new Map<string, google.maps.Polygon>();
  @Input() poiPerHex: Map<string, PointOfInterest[]> = new Map<string, PointOfInterest[]>;
  @Output() showInfotainmentPanel: EventEmitter<[string,string]> = new EventEmitter<[string,string]>();
  @Output() foundHexIds: EventEmitter<Set<string>> = new EventEmitter<Set<string>>();
  searchedHazards : Set<RoadHazardType> = new Set<RoadHazardType>(Object.values(RoadHazardType));
  searchHexIds: Set<string> = new Set<string>();
  searchUserHexIds:Set<string> = new Set<string>();
  smallHexToDisplay:Set<string> = new Set<string>();
  flag =false;
  showPopup = false;
  poiTypes: Set<string> = new Set<string>;
  hexagonIds: Set<string> = new Set<string>;
  polygonIds: string[] = [];
  clickedHexId = '';
  hexDensities: Map<string, number> = new Map<string, number>();

  constructor(private poiService: PoiService, public homepage: HomepageComponent) {}

  
  /**
   * Initializes the component and loads data from a JSON file.
   * Retrieves Points of Interest (POI) from the JSON file and processes it.
   * Populates the hexagonIds Set with unique hexagon IDs found in the data.
   */
  async ngOnInit(): Promise<void> {
    try {
      const response = await fetch('./assets/mock_data_explorer.json');
      const jsonData = await response.json();

      this.poiService.processJson(jsonData);
      this.poiPerHex = this.poiService.getPoiMap();

      const getHex = this.poiPerHex?.keys();

      if (getHex !== undefined) {
        for (const h of getHex) {
          this.hexagonIds.add(h);
        }
      } else {
        this.hexagonIds = new Set();
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  /**
   * Performs actions after the view has been initialized.
   * Checks for the availability of the geolocation API and retrieves the current position if available.
   * Sets the center coordinates of the map based on the current position or uses a default center.
   * Initializes the map component.
   */
  ngAfterViewInit(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.center = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.initializeMap();
      },
      () => {
        this.initializeMap();
      }
    );
  }

  /**
   * Initializes the map component with the specified center coordinates and options.
   * Creates a Google Maps map instance and binds it to the map element in the view.
   * Sets up an event listener for the 'bounds_changed' event to trigger the visualization of hexagons based on the map bounds.
   */
  initializeMap(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      ...this.mapOptions
    });
    google.maps.event.addListener(this.map, 'bounds_changed', () => this.visualizeMap());
  }

  /**
   * Visualizes the hexagons on the map based on the current map bounds.
   * Retrieves the current bounds of the map using the `getBounds` method.
   * Calculates the minimum and maximum latitude and longitude values of the bounds.
   * Creates a `LatLngBounds` object based on the calculated bounds.
   * Clears the previously displayed hexagons from the map.
   * Retrieves the hexagons within the current bounds using the `filterInBounds` method.
   * Displays the filtered hexagons on the map using the `displayHexagons` method.
 */
  visualizeMap(): void {
    const bounds = this.map.getBounds();
    if (bounds) {
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const minLat = sw.lat();
      const maxLat = ne.lat();
      const minLng = sw.lng();
      const maxLng = ne.lng();

      const coords = new google.maps.LatLngBounds(new google.maps.LatLng(minLat, minLng), new google.maps.LatLng(maxLat, maxLng));
      this.displayedHexagons.forEach((hexagon) => {
        hexagon.setMap(null);
      });
      this.displayedHexagons = new Map<string, google.maps.Polygon>();
      const hexInBounds = this.filterInBounds(coords);
      this.hexDensities = this.calculateHexagonDensity(this.poiPerHex);
      this.displayHexagons(hexInBounds, this.poiPerHex)
      }

  }

  /**
   * Filters the hexagons based on whether they fall within the specified bounds.
   * Iterates through the `hexagonIds` Set and checks if each hexagon's coordinates fall within the given bounds.
   * If a hexagon's coordinates are within the bounds, it is added to the resulting Set.
   * Returns a Set containing the hexagons that fall within the specified bounds.
   *
   * @param bounds - The LatLngBounds object representing the bounds to filter the hexagons.
   * @returns A Set of hexagon IDs that fall within the specified bounds.
   */
  filterInBounds(bounds: google.maps.LatLngBounds): Set<string> {
    const res = new Set<string>;
    for (const hex of this.hexagonIds){
      const coords = h3.cellToLatLng(hex);
      const hexLat = coords[0];
      const hexLng = coords[1];
      if (bounds.contains(new google.maps.LatLng(hexLat, hexLng))){
        res.add(hex);
      }
    }
    return res;
  }

  /**
   * Displays hexagons on the map based on the provided hexagon IDs and points of interest (POIs).
   * It iterates through each hexagon ID and checks if it meets the specified conditions to be displayed.
   * Hexagons that meet the conditions are rendered as polygons on the map.
   * The method also attaches click event listeners to the hexagons for interaction.
   *
   * @param hexagons - A Set of hexagon IDs to be displayed on the map.
   * @param poisPerHex - A Map that stores the points of interest (POIs) per hexagon ID.
   */
  displayHexagons(hexagons: Set<string>, poisPerHex: Map<string, PointOfInterest[]>): void {
    for( const hex of this.smallHexToDisplay){
      hexagons.add(hex);
    }
    for (const hex of this.smallHexToDisplay) {
      this.poiService.getPoIsByHexId(hex).filter(x => this.searchedHazards.has(x.type));
    }
    for (const hex of hexagons) {
      const poisInHex = this.poiService.getPoIsByHexId(hex).filter(x => this.searchedHazards.has(x.type))

      const hexagonCoords = h3.cellToBoundary(hex, true);
      const fillOp = this.hexDensities.get(hex) || 0;
      if (h3.getResolution(hex) > resolutionLevel){
        console.log("enters")
        const hexagonPolygon = new google.maps.Polygon({
          paths: hexagonCoords.map((coord) => ({ lat: coord[1], lng: coord[0] })),
          strokeColor: '#fff',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#577D86',
          fillOpacity: 1,
          zIndex: 2
        });

        hexagonPolygon.setMap(this.map);
        this.displayedHexagons.set(hex, hexagonPolygon);
        this.polygonIds.push(hex);
      }
      else if ((this.searchHexIds.has(hex) || this.searchUserHexIds.has(hex)) && poisInHex.length>0 || this.smallHexToDisplay.has(hex) ) {
        const hexagonPolygon = new google.maps.Polygon({
          paths: hexagonCoords.map((coord) => ({ lat: coord[1], lng: coord[0] })),
          strokeColor: '#fff',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#577D86',
          fillOpacity: fillOp,
          zIndex: 2
        });

        hexagonPolygon.addListener('click', (event: google.maps.MapMouseEvent) => {
          this.homepage.enqueue(['hex', hex], this.homepage.past);
          this.homepage.handleSearchTriggered(["hex",  hex])
          this.flag=true;
        });

        hexagonPolygon.setMap(this.map);
        this.displayedHexagons.set(hex, hexagonPolygon);
        this.polygonIds.push(hex);
      } else {
        const pois: PointOfInterest[] | undefined = poisPerHex.get(hex);
        if (typeof pois !== 'undefined' && pois.length > 0) {
          if (pois.map((x) => x.type).filter((y) => this.searchedHazards.has(y)).length > 0) {
            const hexagonPolygon = new google.maps.Polygon({
              paths: hexagonCoords.map((coord) => ({ lat: coord[1], lng: coord[0] })),
              strokeColor: '#577D86',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#577D86',
              fillOpacity: fillOp,
              zIndex: 1
            });


            hexagonPolygon.addListener('mouseover', (event: google.maps.MapMouseEvent) => {

              const model = this.poiService.loadData(hex,"")

              if(model.emergCount > 0){
                this.poiTypes.add("Emergency Conditions")
              }
              if(model.icyCount > 0){
                this.poiTypes.add("Icy Conditions")
              }
              if(model.condCount > 0){
                this.poiTypes.add("Traffic Conditions")
              }
              if(model.aqCount > 0){
                this.poiTypes.add("Aquaplaning")
              }
              if(model.fogCount > 0){
                this.poiTypes.add("Fog")
              }
              if(model.potCount > 0){
                this.poiTypes.add("Potholes")
              }
              if(model.policeCount > 0){
                this.poiTypes.add("Police")
              }
              if(model.cameraCount > 0){
                this.poiTypes.add("Camera")
              }
              if(model.incCount > 0){
                this.poiTypes.add("Incidents")
              }
              if(model.trafficJamsCount > 0){
                this.poiTypes.add("Traffic Jams")
              }

              this.showPopup = true

            });

            hexagonPolygon.addListener('mouseout', (event: google.maps.MapMouseEvent) => {
              this.showPopup = false
              this.poiTypes.clear()
            });

            hexagonPolygon.addListener('click', (event: google.maps.MapMouseEvent) => {
              this.homepage.enqueue(['hex', hex], this.homepage.past);
              this.homepage.handleSearchTriggered(["hex",  hex])
              this.flag=true;
            });

            hexagonPolygon.setMap(this.map);
            this.displayedHexagons.set(hex, hexagonPolygon);
            this.polygonIds.push(hex);


          }
        }
      }
    }
  }

  /**
   * Updates the set of needed road hazards based on the provided set of road hazard types.
   * The method replaces the existing set of searched hazards with the new set.
   *
   * @param neededHazards - A Set of RoadHazardType representing the new set of needed road hazards.
   */
    updateHazards(neededHazards: Set<RoadHazardType>) {
    this.searchedHazards = neededHazards;
  }

  /**
   * Finds and displays a specific hexagon on the map based on the provided hexagon ID.
   * The method retrieves the coordinates of the hexagon, determines its resolution level,
   * and sets the appropriate hexagons to be displayed on the map.
   * It also adjusts the map view to focus on the selected hexagon.
   *
   * @param hexId - A string representing the hexagon ID to be found and displayed.
   * @returns A boolean indicating whether the hexagon was found and displayed successfully.
   *          Returns true if the hexagon was found and displayed, false otherwise.
   */
  findHexagon(hexId: string): boolean {
    try{
      const searchedHex = hexId.replace(/\s/g, "");
      const hexagonCoords = h3.cellToBoundary(searchedHex, true);
      const resolution = h3.getResolution(searchedHex);
      if(resolution == -1 ){
        throw new Error("POI not found");
      } else if(resolution < resolutionLevel){
          const poiIdSet = new Set<string>();
          poiIdSet.add(searchedHex);
          for( const hexId of this.transformHexagonsToLevel(poiIdSet) ){
            this.searchHexIds.add(hexId)
          }
      } else if(resolution > resolutionLevel){
        this.smallHexToDisplay.clear();
        this.smallHexToDisplay.add(searchedHex)
      } else{
        this.searchHexIds.clear();
        this.searchHexIds.add(searchedHex);
      }

      let maxLan = -Infinity;
      let minLan = Infinity;
      let maxLng = -Infinity;
      let minLng = Infinity;
      for(const coord of hexagonCoords){
        maxLan = Math.max(maxLan, coord[0]);
        minLan = Math.min(minLan, coord[0]);
        maxLng = Math.max(maxLng, coord[1]);
        minLng = Math.min(minLng, coord[1]);

      }
      this.visualizeMap();
      const bottomLeft = new google.maps.LatLng(minLng, minLan);
      const topRight = new google.maps.LatLng(maxLng, maxLan);
      this.map.fitBounds(new google.maps.LatLngBounds(bottomLeft, topRight));
      this.visualizeMap();
      this.triggerInfoPanel([SearchFunction.SearchByHex, hexId]);
      return true;
    } catch(error) {
      alert("Hexagon not found");
      return false;
    }
  }

  /**
   * Finds and displays a specific point of interest (POI) on the map based on the provided POI ID.
   * The method retrieves the associated hexagon ID of the POI, determines the resolution level of the hexagon,
   * and sets the appropriate hexagons to be displayed on the map.
   * It also adjusts the map view to focus on the hexagon containing the selected POI.
   *
   * @param poiId - A string representing the ID of the point of interest to be found and displayed.
   * @returns A boolean indicating whether the point of interest was found and displayed successfully.
   *          Returns true if the POI was found and displayed, false otherwise.
   */
  findPoi(poiId: string): boolean {
    try{
      const searchedHex = this.poiService.getPoiArr()
                                       .filter(x => x.id === poiId.replace(/\s/g, ""))
                                       .map(x => x.hexId)[0];

      const hexagonCoords = h3.cellToBoundary(searchedHex, true);
      const resolution = h3.getResolution(searchedHex);
      if(resolution == -1 ){
        throw new Error("POI not found");
      } else if(resolution < resolutionLevel){
          const poiIdSet = new Set<string>();
          poiIdSet.add(searchedHex);
          for( const hexId of this.transformHexagonsToLevel(poiIdSet) ){
            this.searchHexIds.add(hexId)
          }
      } else if(resolution > resolutionLevel){
        this.smallHexToDisplay.clear();
        this.smallHexToDisplay.add(searchedHex)
      } else{
        this.searchHexIds.clear();
        this.searchHexIds.add(searchedHex);
      }
      let maxLan = -Infinity;
      let minLan = Infinity;
      let maxLng = -Infinity;
      let minLng = Infinity;
      for(const coord of hexagonCoords){
        maxLan = Math.max(maxLan, coord[0]);
        minLan = Math.min(minLan, coord[0]);
        maxLng = Math.max(maxLng, coord[1]);
        minLng = Math.min(minLng, coord[1]);

      }
      this.visualizeMap();
      const bottomLeft = new google.maps.LatLng(minLng, minLan);
      const topRight = new google.maps.LatLng(maxLng, maxLan);
      this.map.fitBounds(new google.maps.LatLngBounds(bottomLeft, topRight));
      this.visualizeMap();
      this.triggerInfoPanel([SearchFunction.SearchByPoiId, poiId]);
      return true;
    } catch(error) {
        alert("Point of Interest not found");
        return false;
    }
  }

  /**
   * Finds and displays the hexagons associated with a specific user on the map based on the provided user ID.
   * The method retrieves the associated hexagon IDs of the user's points of interest (POIs),
   * determines the boundaries of these hexagons, and adjusts the map view to focus on the user's hexagons.
   *
   * @param userId - A string representing the ID of the user whose hexagons are to be found and displayed.
   * @returns A boolean indicating whether the user's hexagons were found and displayed successfully.
   *          Returns true if the user's hexagons were found and displayed, false otherwise.
   */
  findUser(userId: string): boolean {
    try{
      let maxLan = -Infinity;
      let minLan = Infinity;
      let maxLng = -Infinity;
      let minLng = Infinity;
      const searchedHexes = this.poiService.getPoiArr()
                                         .filter(x => x.userId === userId)
                                         .map(x => x.hexId);

      if(!(searchedHexes.length > 0)){
        throw new Error("User not found");
      }
      for(const hex of searchedHexes){

        this.searchUserHexIds.add(hex);
        const hexagonCoords = h3.cellToBoundary(hex, true);

        maxLan = Math.max(maxLan, hexagonCoords[0][0]);
        minLan = Math.min(minLan, hexagonCoords[0][0]);
        maxLng = Math.max(maxLng, hexagonCoords[0][1]);
        minLng = Math.min(minLng, hexagonCoords[0][1]);

      }
      const bottomLeft = new google.maps.LatLng(minLng, minLan);
      const topRight = new google.maps.LatLng(maxLng, maxLan);
      this.map.fitBounds(new google.maps.LatLngBounds(bottomLeft, topRight));
      this.searchUserHexIds = this.transformHexagonsToLevel(this.searchUserHexIds);
      this.visualizeMap();
      this.triggerInfoPanel([SearchFunction.SearchByUser, userId]);
      return true;
    } catch(error) {
      alert("User ID not found");
      return false;
    }
  }

  /**
   * Transforms a set of hexagon IDs to a specific resolution level and returns the transformed hexagon IDs.
   * This method allows adjusting the resolution level of the hexagons based on a desired level,
   * by either finding the parent hexagon or obtaining the children hexagons at the specified resolution.
   *
   * @param searchUserHexIds - A set of hexagon IDs to be transformed to the desired resolution level.
   * @returns A set of hexagon IDs at the specified resolution level.
   */
  transformHexagonsToLevel(searchUserHexIds: Set<string>): Set<string>{

    const returnHexes: Set<string> = new Set<string>();
    for ( const hexId of searchUserHexIds)  {
      const hexResolution = h3.getResolution(hexId);
      if(resolutionLevel < hexResolution){
        const parentHexId = h3.cellToParent(hexId, resolutionLevel);
        returnHexes.add(parentHexId);

      } else if(resolutionLevel > hexResolution) {
        const childrenHexIds = h3.cellToChildren(hexId, resolutionLevel);

        for(const child of childrenHexIds){
          searchUserHexIds.add(child);
        }
      } else{
        returnHexes.add(hexId)
      }
    }
    return returnHexes;
  }

  /**
   * Finds and displays a region on the map based on the provided region name.
   * This method uses the Google Maps Geocoding service to retrieve the coordinates of the region,
   * and then fits the map bounds to display the region. It also filters and stores the hexagon IDs
   * that fall within the displayed region.
   *
   * @param region - The name of the region to be found and displayed.
   * @returns A Promise that resolves to a boolean indicating whether the region was successfully found and displayed.
   */
  findRegion(region: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: region }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results && results.length > 0) {
            const result = results[0];
            const geometry = result.geometry;
            const bounds = new google.maps.LatLngBounds(geometry.bounds);
            this.map.fitBounds(bounds);
            this.searchHexIds = this.filterInBounds(bounds);
            this.triggerInfoPanel([SearchFunction.SearchByRegion, result.formatted_address]);
            this.homepage.hexagons = this.searchHexIds;
            resolve(true);
          } else {
            console.error('Geocode was not successful for the following reason:', status);
            alert("Region could not be found");
            resolve(false);
          }
        } else {
          console.error('Geocode was not successful for the following reason:', status);
          alert("Nothing like this found! Are you sure this is what you are looking for?");
          resolve(false);
        }
      });
    });
  }

  /**
   * Triggers the display of the infotainment panel with the provided information tuple.
   * Emits an event to show the infotainment panel with the specified information.
   *
   * @param infoTuple - A tuple containing the information to be displayed in the infotainment panel.
   *                    The first element of the tuple represents the type of search function,
   *                    and the second element represents the corresponding search query or identifier.
   */
  triggerInfoPanel(infoTuple: [string,string]) { 
    this.showInfotainmentPanel.emit(infoTuple);
  }

  /**
   * Clears the search state and resets the map display.
   * This method clears the search results by clearing the sets of search hexagons and user hexagons,
   * as well as the set of small hexagons to display. It then triggers the visualization of the map
   * to update the display accordingly.
   */
  clearSearch(){
    this.searchHexIds.clear();
    this.searchUserHexIds.clear();
    this.smallHexToDisplay.clear();
    this.visualizeMap();
  }

  /**
  * Calculates the density of points of interest (POIs) for each hexagon based on the provided data.
  * The density is calculated as the number of POIs per hexagon divided by the maximum density 
  * to normalize it in the range [0, 1].
  *
  * @param {Map<string, PointOfInterest[]>} poisPerHex - A map where each key is a hexagon id,
  * and the corresponding value is an array of PointOfInterest objects within that hexagon.
  * @returns {Map<string, number>} - A map where each key represents a hexagon id,
  * and the corresponding value is the density of POIs for that hexagon.
  */
  calculateHexagonDensity(poisPerHex: Map<string, PointOfInterest[]>): Map<string, number> {
    const densities = new Map<string, number>();
    let maxDensity = 0;
  
    for (const [hex, pois] of poisPerHex.entries()) {
      const poiCount = pois.length;
      densities.set(hex, poiCount);
      maxDensity = Math.max(maxDensity, poiCount);
    }
  
    for (const [hex, density] of densities.entries()) {
      densities.set(hex, density / maxDensity);
    }
  
    return densities;
  }
}

