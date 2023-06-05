import { Injectable } from '@angular/core';
import {PointOfInterest} from "./models/poi";
import {ChartModel} from "./models/chartModel";



@Injectable({
  providedIn: 'root'
})

export class PoiService {

  poiArr: PointOfInterest[] = [];

  processJson(rawData: PointOfInterest[]): void {
    console.log("type is" + (typeof rawData));
    this.poiArr = rawData.map(data => new PointOfInterest(
      data.id,
      data.type,
      data.createdAt,
      data.hexId,
      data.status,
      data.note,
      data.userId
    ));

    console.log(this.poiArr);

  }
  getPoiArr() : PointOfInterest[] {
    return this.poiArr;
  }
  getPoIsByHexId(hexId: string): PointOfInterest[] {
    const fex = this.poiArr.map(poi => poi.hexId === hexId);
    console.log("Method hexes:" + fex)
    console.log("Target hexes:" + hexId)
    return this.poiArr.filter(poi => poi.hexId === hexId);
  }

  loadData(hexId: string, history: string) {

    const retModel = new ChartModel(0,
      0, 0,0,
      0,0,0,
      0,0,0)


    const poInt = this.getPoIsByHexId(hexId)

    let daysFilter = 18250

    if(history == "year"){
      daysFilter = 365
    }
    else if(history == "month"){
      daysFilter = 30
    }
    else if(history == "week"){
      daysFilter = 7
    }

    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysFilter); // Calculate the start date

    const filtered= poInt.filter(obj => new Date(obj.createdAt) >= startDate && new Date(obj.createdAt) <= currentDate);
    for (const pointOfInterest of filtered) {

      if(pointOfInterest.type == 'Potholes'){
        retModel.potCount++
      }
      else if(pointOfInterest.type == 'Fog'){
        retModel.fogCount++
      }
      else if(pointOfInterest.type == 'Aquaplaning'){
        retModel.aqCount++
      }
      else if(pointOfInterest.type == 'Icy Roads'){
        retModel.icyCount++
      }
      else if(pointOfInterest.type == 'Traffic Jams'){
        retModel.trafficCount++
      }
      else if(pointOfInterest.type == 'Road Emergencies'){
        retModel.emergCount++
      }
      else if(pointOfInterest.type == 'Road Conditions'){
        retModel.condCount++
      }
      else if(pointOfInterest.type == 'Police'){
        retModel.policeCount++
      }
      else if(pointOfInterest.type == 'Cameras And Radars'){
        retModel.cameraCount++
      }
      else if(pointOfInterest.type == 'Incidents'){
        retModel.incCount++
      }

    }

    return retModel

  }
}
