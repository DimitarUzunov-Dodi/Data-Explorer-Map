import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import * as h3 from 'h3-js';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should throw an error if hexagon not found', () => {
    const hexagonId = 'non-existent-hexagon-id';

    expect(() => component.findHexagon([1,hexagonId]).toThrowError('Hexagon not found');
  });
  
});
