import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from './map/map.component'
import { Routes, RouterModule } from '@angular/router';
import { InfotainmentPanelComponent } from './infotainment-panel/infotainment-panel.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FormsModule } from '@angular/forms';



const routes: Routes = [
  { path: '', component: MapComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    InfotainmentPanelComponent,
    TopBarComponent,
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    RouterModule.forRoot(routes),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
