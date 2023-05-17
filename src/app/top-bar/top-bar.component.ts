import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  
})
export class TopBarComponent {
  searchText: string = '';
  @Output() searchTriggered: EventEmitter<string> = new EventEmitter<string>();

  triggerSearch() {
    this.searchTriggered.emit(this.searchText); 
  }

}
