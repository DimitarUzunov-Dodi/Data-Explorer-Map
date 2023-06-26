import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HomepageComponent } from './homepage/homepage.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,],
      declarations: [
        AppComponent,
        HomepageComponent
      ],
    }).compileComponents();
  });

  it('should create', () => {
    expect(HomepageComponent).toBeTruthy();
  });

  

});
