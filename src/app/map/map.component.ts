import { Component, OnInit, ViewChild  } from '@angular/core';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    @ViewChild('map') map: any;
    display: any;
    center!: google.maps.LatLngLiteral;
    zoom = 15;
    mapOptions: google.maps.MapOptions = {
        mapTypeId: 'roadmap',
        disableDefaultUI: true
    };

  constructor() {}

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
}