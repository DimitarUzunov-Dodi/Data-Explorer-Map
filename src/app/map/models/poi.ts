export class PointOfInterest {
  type: RoadHazardType;
  date: Date;
  hexId: string;
  isActive: boolean;

  constructor(type: RoadHazardType, date: Date, hexId: string, isActive: boolean) {
    this.type = type;
    this.date = date;
    this.hexId = hexId;
    this.isActive = isActive;
  }
}

export enum RoadHazardType {
  Potholes = 'Potholes',
  Fog = 'Fog',
  Aquaplaning = 'Aquaplaning',
  IcyRoads = 'Icy Roads',
  TrafficJams = 'Traffic Jams',
  RoadEmergencies = 'Road Emergencies',
  RoadConditions = 'Road Conditions',
  Police = 'Police',
  CamerasAndRadars = 'Cameras And Radars',
  Incidents = 'Incidents',
}
