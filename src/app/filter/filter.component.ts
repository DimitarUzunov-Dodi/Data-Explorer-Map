import { Component, Output, EventEmitter } from '@angular/core';
import { PointOfInterest, RoadHazardType } from 'src/app/Services/models/poi'

@Component({
    selector: 'filter-checkbox',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
  })

export class FilterCheckbox {

  @Output() hazardChecked: EventEmitter<[hazType: string, isChecked: boolean]> = new EventEmitter<[hazType: string, isChecked: boolean]>()

    ngOnInit(): void {
        this.initializeCheckBox();
      }

    initializeCheckBox() {

        // add try/catch to make sure poi is array of string and form is an HTMLElement ?
        const hazards : RoadHazardType[] = Object.values(RoadHazardType);
        const form : HTMLElement | null = document.getElementById('checkBoxForm');

        // console.log(poi);

        for (var i : number = 0; i < hazards.length; i++) {
            var haz : string = hazards[i].toString();

            const checkBox : HTMLInputElement = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.checked = true

            // new Array of keys of RoadHazardTypes for checkbox value so a method can return the key?
            checkBox.value = haz;
            checkBox.onchange = (e : Event) => { this.handleCheckboxChange(checkBox.value, checkBox.checked) };

            const label : HTMLLabelElement = document.createElement('label');
            label.textContent = haz;

            form?.appendChild(checkBox);
            form?.appendChild(label);
            form?.appendChild(document.createElement('br'));
        }
    }

    handleCheckboxChange(hazardType: string, isChecked: boolean) {
      // console.log(hazardType);
      // console.log(isChecked);
      console.log([hazardType, isChecked])
      this.hazardChecked.emit([hazardType, isChecked]);
    }
}