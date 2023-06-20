import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotainmentPanelComponent } from './infotainment-panel.component';
import { HomepageComponent } from '../homepage/homepage.component';

describe('InfotainmentPanelComponent', () => {
  let component: InfotainmentPanelComponent;
  let fixture: ComponentFixture<InfotainmentPanelComponent>;
  let homepage: HomepageComponent;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfotainmentPanelComponent ],
      providers: [HomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfotainmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the panel visibility', () => {
    component.chooseInfPanel = 'smth';
    expect(component.showInfotainmentPanel).toBeFalsy();
    component.togglePanel();
    expect(component.showInfotainmentPanel).toBeTruthy();
    component.togglePanel();
    expect(component.showInfotainmentPanel).toBeFalsy();
  });

  it('should not change visibility', () => {
    expect(component.showInfotainmentPanel).toBeFalsy();
    expect(component.chooseInfPanel).toBe('');
    component.togglePanel();
    expect(component.showInfotainmentPanel).toBeFalsy();
  });
  
  it('should handle the back button functionality', () => {
    component.homepage.past = [['state1', 'state2']];
    component.homepage.current = ['state3', 'state4'];
    const handleSearchTriggeredSpy = spyOn(component.homepage, 'handleSearchTriggered');
    component.backButton();
    expect(component.homepage.past).toEqual([]);
    expect(component.homepage.current).toEqual(['state1', 'state2']);
    expect(component.homepage.future).toEqual([['state3', 'state4']]);
    expect(handleSearchTriggeredSpy).toHaveBeenCalledWith(['state1', 'state2']);
  });

  it('should throw an error if there is no valid previous state', () => {
    component.homepage.past = [];
    component.homepage.current = undefined;
    expect(() => component.backButton()).toThrowError('Invalid previous state');
  });

  it('should handle the forward button functionality', () => {
    component.homepage.future = [['state1', 'state2']];
    component.homepage.current = ['state3', 'state4'];
    const handleSearchTriggeredSpy = spyOn(component.homepage, 'handleSearchTriggered');
    component.forwardButton();
    expect(component.homepage.future).toEqual([]);
    expect(component.homepage.current).toEqual(['state1', 'state2']);
    expect(component.homepage.past).toEqual([['state3', 'state4']]);
    expect(handleSearchTriggeredSpy).toHaveBeenCalledWith(['state1', 'state2']);
  });

  it('should throw an error if there is no valid future state', () => {
    component.homepage.future = [];
    component.homepage.current = undefined;
    expect(() => component.backButton()).toThrowError('Invalid previous state');
  });
  
});
