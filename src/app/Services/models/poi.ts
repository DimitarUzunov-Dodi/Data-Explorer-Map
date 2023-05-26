export class PointOfInterest {
  id: string;
  type: RoadHazardType;
  createdAt: Date;
  hexId: string;
  status: string;
  note: string;

  constructor(id: string, type: RoadHazardType, createdAt: Date, hexId: string, status: string, note: string) {
    this.id = id
    this.type = type;
    this.createdAt = createdAt;
    this.hexId = hexId;
    this.status = status;
    this.note = note;
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
