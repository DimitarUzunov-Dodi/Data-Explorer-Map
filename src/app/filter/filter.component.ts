import { Component, Output, EventEmitter } from '@angular/core';
import { RoadHazardType } from 'src/app/Services/models/poi'

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

    ngOnInit(): void {
      const hazardValues: string[] = Object.values(RoadHazardType);
      this.hazards = hazardValues.map(value => ({
        value,
        checked: true
      }));
      }

    changeState() {
        this.isShown = !this.isShown;
    }

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

    handleCheckboxChange(hazardType: string, isChecked: boolean) {
      console.log(hazardType);
      console.log([hazardType, isChecked])
      this.hazardChecked.emit([hazardType, isChecked]);
    }
}

interface Hazard {
  value: string;
  checked: boolean;
}