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
    const boxes: HTMLInputElement[] = fixture.nativeElement.querySelectorAll('input[name="boxcheck"]');
    const areChecked = true;

    component.selectAll(areChecked);

    expect(component.shouldSelectAll.emit).toHaveBeenCalledWith(areChecked);

    for (const box of boxes) {
      expect(box.checked).toBe(areChecked);
    }
  });

  it('should emit a signal to indicate all hazards deselection and update checkbox states', () => {
    spyOn(component.shouldSelectAll, 'emit');
    const boxes: HTMLInputElement[] = fixture.nativeElement.querySelectorAll('input[name="boxcheck"]');
    const areChecked = false;
    component.selectAll(areChecked);
    expect(component.shouldSelectAll.emit).toHaveBeenCalledWith(areChecked);

    for (const box of boxes) {
      expect(box.checked).toBe(areChecked);
    }
  });

  it('should handle error gracefully in selectAll() when document.getElementsByName() fails', () => {
    spyOn(console, 'log');
    spyOn(component.shouldSelectAll, 'emit');
    spyOn(document, 'getElementsByName').and.throwError('Error occurred');

    component.selectAll(true);

    
    expect(component.shouldSelectAll.emit).not.toHaveBeenCalled();
  });

  it('should emit hazardChecked event when handleCheckboxChange() is called', () => {
    spyOn(component.hazardChecked, 'emit');
    const hazardType = Object.keys(RoadHazardType)[0];
    const isChecked = true;

    component.handleCheckboxChange(hazardType, isChecked);

    expect(component.hazardChecked.emit).toHaveBeenCalledWith([hazardType, isChecked]);
  });

  it('should handle ngOnInit() to initialize hazards list correctly', () => {
    const hazardValues: string[] = Object.values(RoadHazardType);
    component.ngOnInit();

    expect(component.hazards.length).toBe(hazardValues.length);

    for (let i = 0; i < hazardValues.length; i++) {
      expect(component.hazards[i].value).toBe(hazardValues[i]);
      expect(component.hazards[i].checked).toBeTruthy();
    }
  });

  it('should handle edge case when there are no hazards in ngOnInit()', () => {
    spyOn(Object, 'values').and.returnValue([]);

    component.ngOnInit();

    expect(component.hazards.length).toBe(0);
  });
});
