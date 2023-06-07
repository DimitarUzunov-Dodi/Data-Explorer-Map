import { Injectable } from '@angular/core';
import {PointOfInterest} from "./models/poi";
import {ChartModel} from "./models/chartModel";
import { ResolutionLevel } from './models/mapModels';
import * as h3 from 'h3-js';




@Injectable({
  providedIn: 'root'
})

export class PoiService {

  poiArr: PointOfInterest[] = [];
  poiPerHexPerResolution: Map<number, Map<string, PointOfInterest[]>> =
    new Map<number, Map<string, PointOfInterest[]>>();

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
    const beginMapSetup : Map<number, Map<string, PointOfInterest[]>> = new Map<number, Map<string, PointOfInterest[]>>;

    for (const x of Object.values(ResolutionLevel).filter((v) => !isNaN(Number(v)))) {
      beginMapSetup.set(Number(x), new Map<string, PointOfInterest[]>);
    }

    this.poiPerHexPerResolution = this.poiArr.reduce((map, poi) => {
        const poiResolution = h3.getResolution(poi.hexId);
        for(const res of Object.values(ResolutionLevel).filter((v) => !isNaN(Number(v)))) {
          try {
            if (Number(res) < poiResolution) {
              const parentHexId = h3.cellToParent(poi.hexId, Number(res));
              const currResMap: Map<string, PointOfInterest[]> = map.get(Number(res)) as Map<string, PointOfInterest[]>;
              currResMap.get(parentHexId)?.push(poi) ?? currResMap.set(parentHexId, [poi]);
            } else if(Number(res) > poiResolution) {
              const childrenHexIds = h3.cellToChildren(poi.hexId, Number(res));
              const currResMap: Map<string, PointOfInterest[]> = map.get(Number(res)) as Map<string, PointOfInterest[]>;
              childrenHexIds.forEach(h => currResMap.get(h)?.push(poi) ?? currResMap.set(h, [poi]));
            } else {
              const currResMap: Map<string, PointOfInterest[]> = map.get(Number(res)) as Map<string, PointOfInterest[]>;
              currResMap.get(poi.hexId)?.push(poi) ?? currResMap.set(poi.hexId, [poi]);
            }
          } catch (error) {
            console.log("this ahi:" + res + " " + poi)
          }
        }
      return map;
    }, beginMapSetup);
    console.log("setup compete: ");
    console.log(this.poiPerHexPerResolution)
  }

  getPoiMap() {
    return this.poiPerHexPerResolution;
  }

  getPoiArr() : PointOfInterest[] {
    return this.poiArr;
  }
  getPoIsByHexId(hexId: string): PointOfInterest[] {
    const fex = this.poiPerHexPerResolution.get(h3.getResolution(hexId))?.get(hexId) ?? [];
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
