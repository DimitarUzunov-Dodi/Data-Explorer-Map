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

    ngOnInit(): void {
        this.initializeCheckBox();
      }

    changeState() {
      try {
        const minibtn : HTMLElement = document.getElementById('minimizeBtn') as HTMLElement;
        if(this.isShown) {
          minibtn.innerHTML = 'Open Hazard List';
        } else {
          minibtn.innerHTML = 'Close Hazard List';
        }
        this.isShown = !this.isShown;
      } catch (error) {
        console.log(error);
      }
      
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
    
    initializeCheckBox() {

        // add try/catch to make sure poi is array of string and form is an HTMLElement ?
        const hazards : RoadHazardType[] = Object.values(RoadHazardType);
        const form : HTMLElement | null = document.getElementById('checkBoxForm');

        for (let i  = 0; i < hazards.length; i++) {
            const haz : string = hazards[i].toString();

            const checkBox : HTMLInputElement = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.checked = true;

            // new Array of keys of RoadHazardTypes for checkbox value so a method can return the key?
            checkBox.value = haz;
            checkBox.onchange = () => { this.handleCheckboxChange(checkBox.value, checkBox.checked) };
            checkBox.name = 'boxcheck';

            const label : HTMLLabelElement = document.createElement('label');
            label.textContent = haz;

            form?.appendChild(checkBox);
            form?.appendChild(label);
            form?.appendChild(document.createElement('br'));
        }
    }

    handleCheckboxChange(hazardType: string, isChecked: boolean) {
      this.hazardChecked.emit([hazardType, isChecked]);
    }
}