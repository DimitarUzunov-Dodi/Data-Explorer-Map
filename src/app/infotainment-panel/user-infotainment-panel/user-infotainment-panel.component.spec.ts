import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfotainmentPanelComponent } from './user-infotainment-panel.component';
import {HomepageComponent} from "../../homepage/homepage.component";

describe('UserInfotainmentPanelComponent', () => {
  let component: UserInfotainmentPanelComponent;
  let fixture: ComponentFixture<UserInfotainmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInfotainmentPanelComponent,HomepageComponent ],
      imports: [
        HomepageComponent,
        UserInfotainmentPanelComponent
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInfotainmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
