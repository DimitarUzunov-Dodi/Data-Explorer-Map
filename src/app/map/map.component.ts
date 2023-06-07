import {  Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import * as h3 from 'h3-js';
import {PoiService} from "src/app/Services/poi.service";
import { PointOfInterest, RoadHazardType } from 'src/app/Services/models/poi';
import { GoogleMapsModule } from '@angular/google-maps';
import { HomepageComponent } from '../homepage/homepage.component';
import { resolutionLevel } from '../Services/models/mapModels';


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
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
    ],
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

  searchedHazards : Set<RoadHazardType> = new Set<RoadHazardType>(Object.values(RoadHazardType));
  searchHexId = '';
  flag =false;
  hexagonIds: Set<string> = new Set<string>;
  constructor(private poiService: PoiService, private homepage: HomepageComponent) {}

  ngOnInit(): void {
    // Loads json files from file
    fetch('./assets/mock_data_explorer.json').then(async res => {
      this.poiService.processJson(await res.json())
      this.poiPerHex = this.poiService.getPoiMap();
    });
    const getHex = this.poiPerHex?.keys();
    if (getHex != undefined){
      for (const h of getHex) {
        this.hexagonIds.add(h);
      }
    }
    else {
      this.hexagonIds = new Set();
    }
  }


  ngAfterViewInit(): void {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.initializeMap();
        },
        () => {
          this.initializeMap();
        }
      );
    } else {
      this.initializeMap();
    }
  }
   
  initializeMap(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      ...this.mapOptions
    });
    // Initialize the map and create hexagons for the initial bounds
    google.maps.event.addListener(this.map, 'bounds_changed', () => this.visualizeMap());
    
  }

  visualizeMap(): void {
    {
      const bounds = this.map.getBounds();
      if (bounds) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        const minLat = sw.lat();
        const maxLat = ne.lat();
        const minLng = sw.lng();
        const maxLng = ne.lng();

        const coords = [minLat, maxLat, minLng, maxLng];
        this.displayedHexagons.forEach((hexagon) => {
          hexagon.setMap(null);
        });
        this.displayedHexagons = new Map<string, google.maps.Polygon>();

        const hexInBounds = this.filterInBounds(this.hexagonIds, coords);
        this.displayHexagons(hexInBounds, this.poiPerHex)
      }
    }
  }

  filterInBounds(hexagons: Set<string>, bounds: number[]): Set<string> {
    const res = new Set<string>;
    for (const hex of hexagons){
      const coords = h3.cellToLatLng(hex);
      const hexLat = coords[0];
      const hexLng = coords[1];
      if (hexLat >= bounds[0] && hexLat <= bounds[1] && hexLng >= bounds[2] && hexLng <= bounds[3]){
        res.add(hex);
      }
    }
    return res;
  }


  polygonIds: string[] = [];

  clickedHexId = '';

  displayHexagons(hexagons: Set<string>, poisPerHex: Map<string, PointOfInterest[]>): void {
    console.log(hexagons);
    for (const hex of hexagons) {
      const hexagonCoords = h3.cellToBoundary(hex, true);
      if (hex == this.searchHexId) {
        const hexagonPolygon = new google.maps.Polygon({
          paths: hexagonCoords.map((coord) => ({ lat: coord[1], lng: coord[0] })),
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#00FF00',
          fillOpacity: 0.35,
        });
  
        hexagonPolygon.addListener('click', (event: google.maps.MapMouseEvent) => {
          
          const polygonId = hex; 
          console.log('Clicked polygon ID:', polygonId);
          this.homepage.handleSearchTriggered(["hex",  polygonId ], true)
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
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
            });
  
            
            hexagonPolygon.addListener('click', (event: google.maps.MapMouseEvent) => {
              
              const polygonId = hex; 
              console.log('Clicked polygon ID:', polygonId);
              console.log('Pois:', this.poiPerHex.get(polygonId));
              this.homepage.handleSearchTriggered(["hex",  polygonId], true)
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

  updateHazards(neededHazards: Set<RoadHazardType>) {
    this.searchedHazards = neededHazards;
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null){
     this.center = (event.latLng.toJSON());
  }
}

  findHexagon(searchTouple: [string,string]): void {
    const searchCommand = searchTouple[0];
    try {
      
      let searchedHex = '';
      if(searchCommand == SearchFunction.SearchByHex){
        searchedHex = searchTouple[1].replace(/\s/g, "");
      } else if(searchCommand == SearchFunction.SearchByPoiId){
        searchedHex  = this.poiService.getPoiArr()
                                      .filter(x => x.id === searchTouple[1].replace(/\s/g, ""))
                                      .map(x => x.hexId)[0];
      }
       
      const hexagonCoords = h3.cellToBoundary(searchedHex, true);
      const resoulution = h3.getResolution(searchedHex);
      if(resoulution == -1 && searchCommand == SearchFunction.SearchByHex){ 
        throw new Error("Hexagon not found");
      } else if(resoulution == -1 && searchCommand == SearchFunction.SearchByPoiId){
        throw new Error("Point of Interest not found");
      }
      this.searchHexId = searchedHex;
      let zoom = 11;
      const newLocation = new google.maps.LatLng(hexagonCoords[0][1], hexagonCoords[0][0]);
      this.map.panTo(newLocation);
      this.map.setZoom(zoom-1);

    } catch(error) {
      if( searchCommand === SearchFunction.SearchByHex){ 
        alert("Hexagon not found");
        throw new Error("Hexagon not found");
      } else if ( searchCommand === SearchFunction.SearchByPoiId){
        alert("Point of Interest not found");
        throw new Error("Point of Interest not found");
      }      
    }
  
  }
  clearSearch(){
    this.searchHexId = "";
    this.visualizeMap();
  }
  
}

enum SearchFunction{
  SearchByHex = 'hex',
  SearchByPoiId = 'poi',
  SearchByUser = 'user'
}
