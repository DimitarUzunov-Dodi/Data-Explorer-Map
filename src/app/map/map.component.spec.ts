import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { HomepageComponent } from '../homepage/homepage.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      providers: [HomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
