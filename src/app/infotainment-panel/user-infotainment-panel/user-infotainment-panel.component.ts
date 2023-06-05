import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-infotainment-panel',
  templateUrl: './user-infotainment-panel.component.html',
  styleUrls: ['./user-infotainment-panel.component.css']
})
export class UserInfotainmentPanelComponent {
  @Input()
  showInfotainmentPanel = false;

}
