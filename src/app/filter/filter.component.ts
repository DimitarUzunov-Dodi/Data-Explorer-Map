import { Component } from '@angular/core';
import { PointOfInterest, RoadHazardType } from '../map/models/poi'

@Component({
    selector: 'filter-checkbox',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
  })

export class FilterCheckbox {

    ngOnInit(): void {
        this.initializeCheckBox();
      }

    initializeCheckBox() {

        // add try/catch to make sure poi is array of string and form is an HTMLElement ?
        const poi : RoadHazardType[] = Object.values(RoadHazardType);
        const form : HTMLElement | null = document.getElementById('checkBoxForm');

        // console.log(poi);

        for (var i : number = 0; i < poi.length; i++) {
            var haz : string = poi[i].toString();

            const checkBox : HTMLInputElement = document.createElement('input');
            checkBox.type = 'checkbox';
            //checkBox.checked = true

            // new Array of keys of RoadHazardTypes for checkbox value so a method can return the key?
            checkBox.value = haz;
            checkBox.onchange = (e : Event) => { this.handleCheckboxChange(checkBox.checked, checkBox.value) };

            const label : HTMLLabelElement = document.createElement('label');
            label.textContent = haz;

            form?.appendChild(checkBox);
            form?.appendChild(label);
            form?.appendChild(document.createElement('br'));
        }
    }

    handleCheckboxChange(isChecked: boolean, hazardType: string) : [hazType: string, isChecked: boolean] {
      // console.log(hazardType);
      // console.log(isChecked);
      return [hazardType, isChecked];
    }
}