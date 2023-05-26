import {  Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import * as h3 from 'h3-js';
import { GoogleMapsModule } from '@angular/google-maps';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElement: any;
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
    minZoom: 4,
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
  searchHexId: string = ''!;
  @Output() searchTriggered: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit(): void {
    
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
    google.maps.event.addListener(this.map, 'bounds_changed', () => {
      const bounds = this.map.getBounds();
      if (bounds) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
  
        const minLat = sw.lat();
        const maxLat = ne.lat();
        const minLng = sw.lng();
        const maxLng = ne.lng();
  
        const coords = [
          [minLat, minLng],
          [maxLat, minLng],
          [maxLat, maxLng],
          [minLat, maxLng],
        ];
        
        let resolutionLevel: ResolutionLevel;
        const zoom = this.map.getZoom()!;
        if (zoom <= 5) {
          resolutionLevel = ResolutionLevel.CountryLevel;
        } else if (zoom <= 8) {
          resolutionLevel = ResolutionLevel.StateLevel;
        } else if (zoom <= 10) {
          resolutionLevel = ResolutionLevel.CityLevel;
        } else if (zoom <= 13) {
          resolutionLevel = ResolutionLevel.TownLevel;
        } else if (zoom <= 15) {
          resolutionLevel = ResolutionLevel.RoadLevel;
        } else {
          resolutionLevel = ResolutionLevel.RoadwayLevel;
        }
        this.displayedHexagons.forEach((hexagon) => {
          hexagon.setMap(null);
        });
        this.displayedHexagons = new Map<string, google.maps.Polygon>();
        const newHexagonIds = h3.polygonToCells(coords, resolutionLevel + 1, false);
        this.displayHexagons(newHexagonIds, resolutionLevel);
      }
    });
  }

  displayHexagons(hexagons: string[], targetResolution: number): void {
    for (const hex of hexagons) {
      const parentOfHex = h3.cellToParent(hex, targetResolution);
      if (!this.displayedHexagons.has(parentOfHex)){  
        const hexagonCoords = h3.cellToBoundary(parentOfHex, true);
        if(parentOfHex == this.searchHexId){
          const hexagonPolygon = new google.maps.Polygon({
            paths: hexagonCoords.map((coord) => ({ lat: coord[1], lng: coord[0] })),
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00FF00',
            fillOpacity: 0.35,
          });
          hexagonPolygon.setMap(this.map);
          this.displayedHexagons.set(parentOfHex, hexagonPolygon);
        }else{
          const hexagonPolygon = new google.maps.Polygon({
            paths: hexagonCoords.map((coord) => ({ lat: coord[1], lng: coord[0] })),
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
          })
          hexagonPolygon.setMap(this.map);
          this.displayedHexagons.set(parentOfHex, hexagonPolygon);
        }  
      }
    };
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  findHexagon(hexagonId: string): void {
    try {
      const searchedHex = hexagonId.replace(/\s/g, "");
      const hexagonCoords = h3.cellToBoundary(searchedHex, true);
      const resoulution = h3.getResolution(searchedHex);
      if(resoulution == -1){ 
        throw new Error("Hexagon not found");
      }
      this.searchHexId = searchedHex;
      let zoom = 11;

      if (resoulution <= ResolutionLevel.CountryLevel) {
        zoom = 5;
      } else if (resoulution <= ResolutionLevel.StateLevel) {
        zoom = 8;
      } else if (resoulution <= ResolutionLevel.CityLevel) {
        zoom = 10;
      } else if (resoulution <= ResolutionLevel.TownLevel) {
        zoom = 13;
      } else if (resoulution <= ResolutionLevel.RoadLevel) {
        zoom = 15;
      } else {
        zoom = 16;  
      }
      const newLocation = new google.maps.LatLng(hexagonCoords[0][1], hexagonCoords[0][0]);
      this.map.panTo(newLocation);
      this.map.setZoom(zoom);

    } catch(error) {
       alert("Hexagon not found");
       throw new Error("Hexagon not found");
       }
  
  }
  clearSearch(){
    const hexToClear = this.searchHexId;
    this.searchHexId = "";
    const hexagonCoords = h3.cellToBoundary(hexToClear, true);
    const hexagonPolygon = new google.maps.Polygon({
      paths: hexagonCoords.map((coord) => ({ lat: coord[1], lng: coord[0] })),
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    });
    const poligonToRemove = this.displayedHexagons.get(hexToClear);
    poligonToRemove?.setMap(null);
    hexagonPolygon.setMap(this.map);
    this.displayedHexagons.set(hexToClear, hexagonPolygon);
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