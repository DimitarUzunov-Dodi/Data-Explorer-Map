import { Injectable } from '@angular/core';
import {PointOfInterest, RoadHazardType} from "./models/poi";
import {ChartModel} from "./models/chartModel";
import { resolutionLevel } from './models/mapModels';
import * as h3 from 'h3-js';


@Injectable({
  providedIn: 'root'
})

/**
 * The PoiService is a service for managing Points of Interest (POI).
 * It provides several methods to interact with POI,
 * including loading, setting up, filtering,
 * and getting POI data based on different conditions.
 */
export class PoiService {

  /**
   * Array to store the POI data
   */
  poiArr: PointOfInterest[] = [];

  /**
   * A date initialized with the current date
   */
  expDate= new Date();
  /**
   * Array to store the POI data
   */
  poiPerHex: Map<string, PointOfInterest[]> =
    new Map<string, PointOfInterest[]>();

  /**
   * This method processes the input raw data array by mapping it
   * into a PointOfInterest object and stores it in poiArr.
   * @param rawData
   */
  processJson(rawData: PointOfInterest[]): void {
    this.poiArr = rawData.map(data => new PointOfInterest(
      data.id,
      data.type,
      data.createdAt,
      data.hexId,
      data.status,
      data.note,
      data.userId
    ));

    this.setupPois();

  }

  /**
   * This method sets up POI data, based on their hexId resolution,
   * into the poiPerHex map.
   */
  setupPois() {
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
        alert(error);
        throw error;
      }
      return map;
    }, beginMapSetup);
  }

  /**
   * This method returns the poiPerHex map.
   */
  getPoiMap() {
    return this.poiPerHex;
  }

  /**
   * This method returns the poiArr array.
   */
  getPoiArr() : PointOfInterest[] {
    return this.poiArr;
  }

  /**
   * This method returns all POI data associated with the given hexId.
   * @param hexId
   * @returns An array of POIs located in the specified hex
   */
  getPoIsByHexId(hexId: string): PointOfInterest[] {
    const fex = this.poiPerHex.get(hexId) ?? [];

    return fex;
  }

  /**
   * This method filters POI data by date range
   * based on the provided
   * 'history' argument (year, month, week) and hexId.
   * It returns an instance of ChartModel with the updated
   * count for each type of road hazard.
   * @param hexId -
   * @param history - period specified in the past, if left unspecified it will
   * take into account all road hazards
   * @returns ChartModel - The model contains info which is then loaded to the chart
   */
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

  /**
   * This method filters the POI array based on the given userId.
   * @param userId
   */
  getUserPOIs(userId: string){

    return this.poiArr.filter(x => x.userId == userId)
  }


  /**
   * This method returns an array of tuples (identified by hexId and resolution) that are associated with the provided poiId.
   * @param poiId
   */
  getHexagonsByPoiId(poiId: string): { hexId: string, resolution: number }[] {
    const hexagons: { hexId: string, resolution: number }[] = [];


      for (const [hexId, pois] of this.poiPerHex.entries()) {
        const matchingPois = pois.filter(poi => poi.id === poiId);

        if (matchingPois.length > 0) {
          const resolution =  h3.getResolution(hexId);
          hexagons.push({ hexId, resolution});
        }

    }

    return hexagons;
  }

  /**
   * This method calculates the expiration date for a given point of interest, based on its type.
   * The expiration date varies depending on the type of the road hazard.
   * @param p
   */
  getExpDate(p: PointOfInterest): Date{
    switch (p.type){
      case RoadHazardType.Potholes:
        this.expDate = new Date(p.createdAt);
        this.expDate.setMonth(this.expDate.getMonth() + 6);
        return this.expDate;
      case RoadHazardType.Fog:
        this.expDate = new Date(p.createdAt);
        this.expDate.setDate(this.expDate.getDate() + 1);
        return this.expDate;
      case RoadHazardType.Aquaplaning:
        this.expDate = new Date(p.createdAt);
        this.expDate.setDate(this.expDate.getDate() + 1);
        return this.expDate;
      case RoadHazardType.IcyRoads:
        this.expDate = new Date(p.createdAt);
        this.expDate.setDate(this.expDate.getDate() + 2);
        return this.expDate;
      case RoadHazardType.TrafficJams:
        this.expDate = new Date(p.createdAt);
        this.expDate.setDate(this.expDate.getDate() + 1);
        return this.expDate;
      case RoadHazardType.RoadEmergencies:
        this.expDate = new Date(p.createdAt);
        this.expDate.setDate(this.expDate.getDate() + 1);
        return this.expDate;
      case RoadHazardType.RoadConditions:
      this.expDate = new Date(p.createdAt);
      this.expDate.setDate(this.expDate.getDate() + 1);
      return this.expDate;
      case RoadHazardType.Police:
        this.expDate = new Date(p.createdAt);
        this.expDate.setDate(this.expDate.getDate() + 1);
        return this.expDate;
      case RoadHazardType.CamerasAndRadars:
        this.expDate = new Date(p.createdAt);
        this.expDate.setMonth(this.expDate.getMonth() + 6);
        return this.expDate;

      case RoadHazardType.Incidents:
      this.expDate = new Date(p.createdAt);
      this.expDate.setDate(this.expDate.getDate() + 1);
      return this.expDate;

    }
  }
}
