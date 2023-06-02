import { Injectable } from '@angular/core';
import {PointOfInterest} from "./models/poi";



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
    return this.poiArr.filter(poi => poi.hexId === hexId);
  }



  // loadData(): void {
  //     // Just in case data needs to be fetched from server
  //     // this.http.get<any[]>('./example_data/mock_data_explorer.json').subscribe(
  //     //   (data: any[]) => {
  //     //     this.processJson(data)
  //     //     // Process the JSON array here
  //     //   },
  //     //   (error: any) => {
  //     //     console.error('Error reading JSON file:', error);
  //     //   }
  //     // );
  //
  //     this.processJson(pois)
  //
  //
  // }


}
