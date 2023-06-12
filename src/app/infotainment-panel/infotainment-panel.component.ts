
import { Component, ViewChild} from '@angular/core';
import { HexagonInfotainmentPanelComponent } from './hexagon-infotainment-panel/hexagon-infotainment-panel.component';
import { HomepageComponent } from '../homepage/homepage.component';

@Component({
  selector: 'app-infotainment-panel',
  templateUrl: './infotainment-panel.component.html',
  styleUrls: ['./infotainment-panel.component.css'],

})
export class InfotainmentPanelComponent {
  showInfotainmentPanel = false;
  searchedId = '';
  chooseInfPanel = "";
  togglePanel(): void {
    this.showInfotainmentPanel = !this.showInfotainmentPanel;
  }
  constructor(private homepage: HomepageComponent){}
  backButton():void {
    console.log("Does it work")
    if (!this.homepage.isEmpty(this.homepage.past) && this.homepage.current != undefined){
      console.log("Before")
      console.log(this.homepage.past)
      console.log(this.homepage.current)
      console.log(this.homepage.future)
      const cur = this.homepage.pop(this.homepage.past)
      console.log("Current " + cur)
      this.homepage.future.push(cur)
      this.homepage.handleSearchTriggered(this.homepage.current)
      console.log("After")
      console.log(this.homepage.past)
      console.log(this.homepage.current)
      console.log(this.homepage.future)
    }
    else {
      throw new Error("")
    }
  }

  forwardButton():void {
    if (!this.homepage.isEmpty(this.homepage.future) && this.homepage.current != undefined){
      const cur = this.homepage.pop(this.homepage.future)
      this.homepage.past.push(cur)
      this.homepage.handleSearchTriggered(this.homepage.current)
    }
    else {
      throw new Error("")
    }
  }
}
