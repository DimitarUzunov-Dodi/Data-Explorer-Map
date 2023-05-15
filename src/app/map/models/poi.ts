class PointOfInterest {
  type: 'fog' | 'icy road' | 'strong wind' | 'pothole' | 'police' | 'road hazard';
  date: Date;
  hexId: string;
  isActive: boolean;

  constructor(type: 'fog' | 'icy road' | 'strong wind' | 'pothole' | 'police' | 'road hazard', date: Date, hexId: string, isActive: boolean) {
    this.type = type;
    this.date = date;
    this.hexId = hexId;
    this.isActive = isActive;
  }


}
