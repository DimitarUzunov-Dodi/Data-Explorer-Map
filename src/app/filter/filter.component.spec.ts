import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterCheckbox, Hazard } from './filter.component';
import { RoadHazardType } from '../Services/models/poi';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FilterCheckbox', () => {
  let component: FilterCheckbox;
  let fixture: ComponentFixture<FilterCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterCheckbox],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCheckbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize hazards list with values from RoadHazardType enum', () => {
    expect(component.hazards.length).toBe(Object.keys(RoadHazardType).length);
    expect(component.hazards[0].value).toBe(Object.keys(RoadHazardType)[0]);
    expect(component.hazards[1].value).toBe(Object.keys(RoadHazardType)[1]);
  });

  it('should toggle the state of isShown when changeState() is called', () => {
    expect(component.isShown).toBeFalsy();
    component.changeState();
    expect(component.isShown).toBeTruthy();
    component.changeState();
    expect(component.isShown).toBeFalsy();
  });

  it('should emit a signal to indicate all hazards selection and update checkbox states', () => {
    spyOn(component.shouldSelectAll, 'emit');
  
    component.selectAll(false);
    expect(component.shouldSelectAll.emit).toHaveBeenCalledWith(false);
  
    component.selectAll(true);
    expect(component.shouldSelectAll.emit).toHaveBeenCalledWith(true);
  });
  

  it('should emit hazardChecked event when handleCheckboxChange() is called', () => {
    spyOn(component.hazardChecked, 'emit');
    const hazardType = RoadHazardType.Potholes;
    const isChecked = true;
    component.handleCheckboxChange(hazardType, isChecked);
    expect(component.hazardChecked.emit).toHaveBeenCalledWith([hazardType, isChecked]);
  });
});
