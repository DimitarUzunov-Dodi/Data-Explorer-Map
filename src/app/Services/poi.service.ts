import { Injectable } from '@angular/core';
import {PointOfInterest} from "./models/poi";
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PoiService {

  constructor(private http: HttpClient) { }

  processJson(rawData: any[]): void {

    let poiArr = rawData.map(data => new PointOfInterest(
      data.type,
      data.hexId,
      data.id,
      data.note,
      data.status,
      data.createdAt
    ));

    //Add filters or directly visualize

    console.log(poiArr)

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
