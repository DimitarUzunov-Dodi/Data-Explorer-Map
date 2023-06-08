import { Injectable } from '@angular/core';
import {PointOfInterest} from "./models/poi";
import {ChartModel} from "./models/chartModel";
import { resolutionLevel } from './models/mapModels';
import * as h3 from 'h3-js';




@Injectable({
  providedIn: 'root'
})

export class PoiService {

  poiArr: PointOfInterest[] = [];
  poiPerHex: Map<string, PointOfInterest[]> =
    new Map<string, PointOfInterest[]>();

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
    this.setupPois();

  }

  setupPois() {
    console.log("begin setup");
    const beginMapSetup : Map<string, PointOfInterest[]> = new Map<string, PointOfInterest[]>;

    this.poiPerHex = this.poiArr.reduce((map, poi) => {
      try {
      const poiResolution = h3.getResolution(poi.hexId);
        if (resolutionLevel < poiResolution) {
          const parentHexId = h3.cellToParent(poi.hexId, resolutionLevel);
          map.get(parentHexId)?.push(poi) ?? map.set(parentHexId, [poi]);
        } else if(resolutionLevel > poiResolution) {
          const childrenHexIds = h3.cellToChildren(poi.hexId, resolutionLevel);
          childrenHexIds.forEach(h => map.get(h)?.push(poi) ?? map.set(h, [poi]));
        } else {
          map.get(poi.hexId)?.push(poi) ?? map.set(poi.hexId, [poi]);
        }
      } catch (error) {
        console.log("this ahi:" + resolutionLevel + " " + poi)
      }
      return map;
    }, beginMapSetup);
    console.log("setup compete: ");
    console.log(this.poiPerHex)
  }

  getPoiMap() {
    return this.poiPerHex;
  }

  getPoiArr() : PointOfInterest[] {
    return this.poiArr;
  }
  getPoIsByHexId(hexId: string): PointOfInterest[] {
    const fex = this.poiPerHex.get(hexId) ?? [];
    console.log(fex);
    return fex;
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
      else if(pointOfInterest.type == 'TrafficJams'){
        retModel.trafficJamsCount++
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
