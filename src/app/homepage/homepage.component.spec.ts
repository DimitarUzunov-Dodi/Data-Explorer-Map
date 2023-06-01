import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Output, EventEmitter } from '@angular/core';
import { HomepageComponent } from './homepage.component';
import { FilterCheckbox } from '../filter/filter.component';
import { InfotainmentPanelComponent } from '../infotainment-panel/infotainment-panel.component';

@Component({
  selector: 'app-top-bar',
  template: '',
})
class MockTopBarComponent {
  @Output() searchTriggered = new EventEmitter();
  @Output() clearSearchTriggered = new EventEmitter();
}


@Component({
  selector: 'app-map',
  template: '',
})
class MockMapComponent {}

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageComponent, MockTopBarComponent, MockMapComponent, FilterCheckbox, InfotainmentPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});