import { Component, Output, EventEmitter } from '@angular/core';
import { RoadHazardType } from 'src/app/Services/models/poi';

@Component({
    selector: 'filter-checkbox',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
  })

export class FilterCheckbox {

  @Output() hazardChecked: EventEmitter<[hazType: string, isChecked: boolean]> = new EventEmitter<[hazType: string, isChecked: boolean]>()
  @Output() shouldSelectAll: EventEmitter<boolean> = new EventEmitter();

  isShown  = false;

  hazards: Hazard[] = [];

  /**
   * Initializes the filter component by creating the hazard list object to be passed
   * to the html part
   */
  ngOnInit(): void {
    const hazardValues: string[] = Object.values(RoadHazardType);
    this.hazards = hazardValues.map(value => ({
      value,
      checked: true
    }));
    }

  /**
   * function that keeps changes weather or not the filter part is shown
   */
  changeState() {
      this.isShown = !this.isShown;
  }

  /**
   * When one of the selector buttons are clicked this method will send out a signal
   * to the main logic component and visually indicate weather hazards are selected/deselected
   * @param areChecked : should all hazards be selected or deselected
   */
  selectAll(areChecked: boolean) {
    try {
      const boxes : NodeListOf<HTMLInputElement> = <NodeListOf<HTMLInputElement>> document.getElementsByName('boxcheck');
      for(let i=0; i<boxes.length; i++) {
        boxes[i].checked = areChecked;
      }
      this.shouldSelectAll.emit(areChecked);
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * Sends a signal whenever a single hazard is selected/deselected
   * @param hazardType : name of hazard whose state is being changed
   * @param isChecked : weather the selected hazard is being selected or deselected
   */
  handleCheckboxChange(hazardType: string, isChecked: boolean) {
    this.hazardChecked.emit([hazardType, isChecked]);
  }
}

/**
 * interface to make it easier to create the initial structure of the filter
 */
export interface Hazard {
  value: string;
  checked: boolean;
}