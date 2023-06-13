import { Component,Input, } from '@angular/core';
import { PointOfInterest } from 'src/app/Services/models/poi';
import { PoiService } from 'src/app/Services/poi.service';
import { HomepageComponent } from 'src/app/homepage/homepage.component';

@Component({
  selector: 'app-poi-infotainment-panel',
  templateUrl: './poi-infotainment-panel.component.html',
  styleUrls: ['./poi-infotainment-panel.component.css']
})
export class PoiInfotainmentPanelComponent {
  @Input()
  showInfotainmentPanel = false;
  @Input() selectedPoiId = '';
  constructor(private poiService: PoiService, private homepage: HomepageComponent) {}
  poi: PointOfInterest | null = null;
  expDate = new Date();
  stat = ''; 
  ngOnInit(){
    this.poi = this.poiService.getPoiArr().find((poi) => poi.id === this.selectedPoiId) ?? null;
    if(this.poi){
      this.expDate = this.poiService.getExpDate(this.poi)
    }
    this.getStatus();
    this.getHexagons();
  }

  hexIdMaxRes = '';

  getHexagons():void{
   const v = this.poiService.getHexagonsByPoiId(this.selectedPoiId).sort((a, b) => b.resolution - a.resolution);
   if(v[0]){
    this.hexIdMaxRes = v[0].hexId;
   }
  
  }

  openHexInfotainment(hexId: string){
    this.homepage.enqueue(["hex", hexId], this.homepage.past);
    this.homepage.handleSearchTriggered(["hex", hexId])
  }

  openUserInfotainment(userId :string){
    this.homepage.enqueue(["user", userId], this.homepage.past);
    this.homepage.handleSearchTriggered(["user", userId])
  }

  getStatus():void {
    const currTime = new Date();
    if (this.expDate< currTime){
      this.stat="Expired";
    }else{
      this.stat = "Active"
    }
  }


}
