import { Component, ViewChild, Input } from '@angular/core';
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
  chooseInfPanel = '';
  @Input() hexagons: Set<string> = new Set<string>;

  /**
   * Toggles the visibility of the infotainment panel.
   */
  togglePanel(): void {
    if (this.chooseInfPanel !== '') {
      this.showInfotainmentPanel = !this.showInfotainmentPanel;
    }
  }

  /**
   * Initializes the InfotainmentPanelComponent.
   * @param homepage - The HomepageComponent instance.
   */
  constructor(private homepage: HomepageComponent) {}

  /**
   * Handles the back button functionality.
   * Throws an error if there is no valid previous state.
   */
  backButton(): void {
    if (!this.homepage.isEmpty(this.homepage.past) && this.homepage.current !== undefined) {
      const cur = this.homepage.pop(this.homepage.past);
      this.homepage.future.push(cur);
      this.homepage.handleSearchTriggered(this.homepage.current);
    } else {
      throw new Error('Invalid previous state');
    }
  }

  /**
   * Handles the forward button functionality.
   * Throws an error if there is no valid future state.
   */
  forwardButton(): void {
    if (!this.homepage.isEmpty(this.homepage.future) && this.homepage.current !== undefined) {
      const cur = this.homepage.pop(this.homepage.future);
      this.homepage.past.push(cur);
      this.homepage.handleSearchTriggered(this.homepage.current);
    } else {
      throw new Error('Invalid future state');
    }
  }
}
