export class ChartModel {
  potCount: number;
  fogCount: number;
  aqCount: number;
  icyCount: number;
  trafficJamsCount: number;
  emergCount: number;
  condCount: number;
  policeCount: number;
  cameraCount: number;
  incCount: number


  constructor(potCount: number,
              fogCount: number, aqCount: number, icyCount: number,
              trafficJamsCount: number, emergCount: number, condCount: number,
              policeCount: number, cameraCount: number, incCount: number) {

    this.potCount = potCount
    this.fogCount = fogCount;
    this.aqCount = aqCount;
    this.icyCount = icyCount;
    this.trafficJamsCount = trafficJamsCount;
    this.emergCount = emergCount;
    this.condCount = condCount;
    this.policeCount = policeCount;
    this.cameraCount = cameraCount;
    this.incCount = incCount;

  }
}
