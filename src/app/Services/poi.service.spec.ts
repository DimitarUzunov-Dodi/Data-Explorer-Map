import { TestBed } from '@angular/core/testing';
import { PoiService } from './poi.service';
import { PointOfInterest, RoadHazardType } from './models/poi';
import { combineLatest } from 'rxjs';

describe('PoiService', () => {
  let service: PoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  //processJson
  it('should process the input JSON data', () => {
    const rawData = [
      {
        id: "135892",
        type:  RoadHazardType.Police,
        createdAt: new Date('2016-11-04T16:57:11.718Z'),
        hexId : "891eccb6ecbffff",
        status: "Active",
        note : "mock_note",
        userId: 'user1'
      },
      {
        id: "1538592",
        type:  RoadHazardType.Police,
        createdAt: new Date('2013-01-04T14:36:31.644Z'),
        hexId : "891ecc7a8a3ffff",
        status: "Active",
        note : "mock_note",
        userId: 'user1'
      },
      {
        id: "152628",
        type:  RoadHazardType.Police,
        createdAt: new Date('2018-11-12T14:10:52.985Z'),
        hexId : "891ec1bb28bffff",
        status: "Active",
        note : "mock_note",
        userId: 'user1'
      }
    ];

    service.processJson(rawData);
    const setupSpy = spyOn(service, "setupPois");
    expect(service.getPoiArr().length).toBe(rawData.length);
    expect(service.getPoiArr()[2]).toEqual(new PointOfInterest(
        "152628", 
        RoadHazardType.Police,
        new Date('2018-11-12T14:10:52.985Z'),
        "891ec1bb28bffff",
        "Active",
        "mock_note",
        'user1'))
  });


  //setupPois
  it('should setup POIs', () => {
    service.poiArr = [
      {
        id: "135892",
        type:  RoadHazardType.Police,
        createdAt: new Date('2016-11-04T16:57:11.718Z'),
        hexId : "891eccb6ecbffff",
        status: "Active",
        note : "mock_note",
        userId: 'user1'
      },
      {
        id:"1543310",
        type:RoadHazardType.Fog,
        createdAt:new Date('2011-11-23T04:30:09.369Z'),
        hexId:"861ee3577ffffff",
        status:"Active",
        note:"mock_note",
        userId:"user2"
      },
      {
        id:"12525572",
        type: RoadHazardType.TrafficJams,
        createdAt:new Date('2023-02-15T07:51:16.656Z'),
        hexId:"881ec466d9fffff",
        status:"Active",
        note:"mock_note",
        userId:"user5"
      }
    ];

    service.setupPois();
    expect(service.poiPerHex.size).toBe(51);
  });


  //getPoIsByHexId
  it('should return POIs associated with a specific hexId', () => {
    const hexId = '891ec1bb28bffff';
    service.poiPerHex.set("891ec1bb28bffff", [
      new PointOfInterest(
      "152628", 
      RoadHazardType.Police,
      new Date('2018-11-12T14:10:52.985Z'),
      "891ec1bb28bffff",
      "Active",
      "mock_note",
      'user1'),
      new PointOfInterest(
        "152628", 
        RoadHazardType.Police,
        new Date('2018-11-12T14:10:52.985Z'),
        "891ec1bb28bffff",
        "Active",
        "mock_note",
        'user1'),
        new PointOfInterest(
          "152628", 
          RoadHazardType.Police,
          new Date('2018-11-12T14:10:52.985Z'),
          "891ec1bb28bffff",
          "Active",
          "mock_note",
          'user1')
    ]);
    service.poiPerHex.set("8e1eea6584a8007", [
      new PointOfInterest(
      "12316242", 
      RoadHazardType.Potholes,
      new Date('2018-11-12T14:10:52.985Z'),
      "8e1eea6584a8007",
      "Active",
      "mock_note",
      'user1'),
    ]);
    const pois = service.getPoIsByHexId(hexId);

    expect(pois.length).toBe(3);
  });


  //loadData
  it('should filter POI data for Year', () => {
    const hexId = '891ec1bb28bffff';
    const history = 'year';
    const validDate = new Date();
    validDate.setDate(validDate.getDate() - 300);
    const invalidDate = new Date();
    invalidDate.setDate(invalidDate.getDate() - 400);
    service.poiPerHex.set("891ec1bb28bffff", [
      new PointOfInterest(
      "152628", 
      RoadHazardType.Potholes,
      new Date(validDate),
      "891ec1bb28bffff",
      "Active",
      "mock_note",
      'user1'),
      new PointOfInterest(
        "152628", 
        RoadHazardType.Fog,
        new Date(validDate),
        "891ec1bb28bffff",
        "Active",
        "mock_note",
        'user1'),
        new PointOfInterest(
          "152628", 
          RoadHazardType.Aquaplaning,
          new Date(invalidDate),
          "891ec1bb28bffff",
          "Active",
          "mock_note",
          'user1')
    ]);
    service.poiPerHex.set("8e1eea6584a8007", [
      new PointOfInterest(
      "12316242", 
      RoadHazardType.Potholes,
      new Date(validDate),
      "8e1eea6584a8007",
      "Active",
      "mock_note",
      'user1'),
    ]);
    const chartModel = service.loadData(hexId, history);

    expect(chartModel).toBeDefined();
    expect(chartModel.potCount).toBe(1);
    expect(chartModel.fogCount).toBe(1);
    expect(chartModel.aqCount).toBe(0);
  });

  it('should filter POI data for Month', () => {
    const hexId = '891ec1bb28bffff';
    const history = 'month';
    const validDate = new Date();
    validDate.setDate(validDate.getDate() - 20);
    const invalidDate = new Date();
    invalidDate.setDate(invalidDate.getDate() - 40);
    service.poiPerHex.set("891ec1bb28bffff", [
      new PointOfInterest(
      "152628", 
      RoadHazardType.Aquaplaning,
      new Date(validDate),
      "891ec1bb28bffff",
      "Active",
      "mock_note",
      'user1'),
      new PointOfInterest(
        "152628", 
        RoadHazardType.IcyRoads,
        new Date(validDate),
        "891ec1bb28bffff",
        "Active",
        "mock_note",
        'user1'),
        new PointOfInterest(
          "152628", 
          RoadHazardType.TrafficJams,
          new Date(invalidDate),
          "891ec1bb28bffff",
          "Active",
          "mock_note",
          'user1')
    ]);
    service.poiPerHex.set("8e1eea6584a8007", [
      new PointOfInterest(
      "12316242", 
      RoadHazardType.Potholes,
      new Date(validDate),
      "8e1eea6584a8007",
      "Active",
      "mock_note",
      'user1'),
    ]);
    const chartModel = service.loadData(hexId, history);

    expect(chartModel).toBeDefined();
    expect(chartModel.aqCount).toBe(1);
    expect(chartModel.icyCount).toBe(1);
    expect(chartModel.trafficJamsCount).toBe(0);
  });

  it('should filter POI data for Week', () => {
    const hexId = '891ec1bb28bffff';
    const history = 'week';
    const validDate = new Date();
    validDate.setDate(validDate.getDate() - 5);
    const invalidDate = new Date();
    invalidDate.setDate(invalidDate.getDate() - 10);
    service.poiPerHex.set("891ec1bb28bffff", [
      new PointOfInterest(
      "152628", 
      RoadHazardType.TrafficJams,
      new Date(validDate),
      "891ec1bb28bffff",
      "Active",
      "mock_note",
      'user1'),
      new PointOfInterest(
        "152628", 
        RoadHazardType.RoadEmergencies,
        new Date(validDate),
        "891ec1bb28bffff",
        "Active",
        "mock_note",
        'user1'),
        new PointOfInterest(
          "152628", 
          RoadHazardType.RoadConditions,
          new Date(invalidDate),
          "891ec1bb28bffff",
          "Active",
          "mock_note",
          'user1')
    ]);
    service.poiPerHex.set("8e1eea6584a8007", [
      new PointOfInterest(
      "12316242", 
      RoadHazardType.Potholes,
      new Date(validDate),
      "8e1eea6584a8007",
      "Active",
      "mock_note",
      'user1'),
    ]);
    const chartModel = service.loadData(hexId, history);

    expect(chartModel).toBeDefined();
    expect(chartModel.trafficJamsCount).toBe(1);
    expect(chartModel.emergCount).toBe(1);
    expect(chartModel.condCount).toBe(0);
  });

  it('should filter POI data for Week And Rest', () => {
    const hexId = '891ec1bb28bffff';
    const history = 'week';
    const validDate = new Date();
    validDate.setDate(validDate.getDate() - 5);
    const invalidDate = new Date();
    invalidDate.setDate(invalidDate.getDate() - 10);
    service.poiPerHex.set("891ec1bb28bffff", [
      new PointOfInterest(
      "152628", 
      RoadHazardType.RoadConditions,
      new Date(validDate),
      "891ec1bb28bffff",
      "Active",
      "mock_note",
      'user1'),
      new PointOfInterest(
        "152628", 
        RoadHazardType.Police,
        new Date(validDate),
        "891ec1bb28bffff",
        "Active",
        "mock_note",
        'user1'),
        new PointOfInterest(
          "152628", 
          RoadHazardType.CamerasAndRadars,
          new Date(validDate),
          "891ec1bb28bffff",
          "Active",
          "mock_note",
          'user1'),
          new PointOfInterest(
            "152628", 
            RoadHazardType.Incidents,
            new Date(validDate),
            "891ec1bb28bffff",
            "Active",
            "mock_note",
            'user1')
    ]);
    const chartModel = service.loadData(hexId, history);

    expect(chartModel).toBeDefined();
    expect(chartModel.condCount).toBe(1);
    expect(chartModel.policeCount).toBe(1);
    expect(chartModel.cameraCount).toBe(1);
    expect(chartModel.incCount).toBe(1);
  });

  //getUserPOIs
  it('should filter the POI array based on the given userId', () => {
    const userId = 'user2';
    service.poiArr = [
      new PointOfInterest(
        "1", 
        RoadHazardType.Police,
        new Date('2016-11-04T16:57:11.718Z'),
        "891ec1bb28bffff",
        "Active",
        "mock_note",
        'user1'),
        new PointOfInterest(
          "2", 
          RoadHazardType.Police,
          new Date('2016-11-04T16:57:11.718Z'),
          "891ec1bb28bffff",
          "Active",
          "mock_note",
          'user2'),
          new PointOfInterest(
            "3", 
            RoadHazardType.Police,
            new Date('2016-11-04T16:57:11.718Z'),
            "891ec1bb28bffff",
            "Active",
            "mock_note",
            'user1'),
            new PointOfInterest(
              "4", 
              RoadHazardType.Police,
              new Date('2016-11-04T16:57:11.718Z'),
              "891ec1bb28bffff",
              "Active",
              "mock_note",
              'user2'),
    ]
    const userPOIs = service.getUserPOIs(userId);

    expect(userPOIs.length).toBe(2);
    expect(userPOIs).toEqual([        
      new PointOfInterest(
        "2", 
        RoadHazardType.Police,
        new Date('2016-11-04T16:57:11.718Z'),
        "891ec1bb28bffff",
        "Active",
        "mock_note",
        'user2'),
      new PointOfInterest(
        "4", 
        RoadHazardType.Police,
        new Date('2016-11-04T16:57:11.718Z'),
        "891ec1bb28bffff",
        "Active",
        "mock_note",
        'user2'),
    ]);
    // Add more assertions as needed
  });

  //getHexagonsByPoiId
  it('should return an array of hexagons associated with a specific poiId', () => {
    const poiId = '1';
    service.poiPerHex.set("8e1eea6584a8007", [
      new PointOfInterest(
      "1", 
      RoadHazardType.Potholes,
      new Date('2016-11-04T16:57:11.718Z'),
      "8e1eea6584a8007",
      "Active",
      "mock_note",
      'user1'),
        new PointOfInterest(
        "2", 
        RoadHazardType.Potholes,
        new Date('2016-11-04T16:57:11.718Z'),
        "8e1eea6584a8007",
        "Active",
        "mock_note",
        'user1'),
    ]);
    service.poiPerHex.set("8e1eea6584a8008", [
      new PointOfInterest(
      "3", 
      RoadHazardType.Potholes,
      new Date('2016-11-04T16:57:11.718Z'),
      "8e1eea6584a8007",
      "Active",
      "mock_note",
      'user1')
    ]);
    const hexagons = service.getHexagonsByPoiId(poiId);

    expect(hexagons.length).toBe(1);
  });

  //getExpDate
  it('expDate for Police', () => {
    const validDate = new Date('2016-11-04T16:57:11.718Z');
    validDate.setDate(validDate.getDate() + 1);
    const poi =       {
      id: "135892",
      type:  RoadHazardType.Police,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };

    const expDate = service.getExpDate(poi);

    expect(expDate).toEqual(validDate);
  });

  it('expDate for Fog', () => {
    const validDate = new Date('2016-11-04T16:57:11.718Z');
    validDate.setDate(validDate.getDate() + 1);
    const poi =       {
      id: "135892",
      type:  RoadHazardType.Fog,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };

    const expDate = service.getExpDate(poi);

    expect(expDate).toEqual(validDate);
  });

  it('expDate for Aqua', () => {
    const validDate = new Date('2016-11-04T16:57:11.718Z');
    validDate.setDate(validDate.getDate() + 1);
    const poi =       {
      id: "135892",
      type:  RoadHazardType.Aquaplaning,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };

    const expDate = service.getExpDate(poi);

    expect(expDate).toEqual(validDate);
  });

  it('expDate for IcyRoads', () => {
    const validDate = new Date('2016-11-04T16:57:11.718Z');
    validDate.setDate(validDate.getDate() + 2);
    const poi =       {
      id: "135892",
      type:  RoadHazardType.IcyRoads,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };

    const expDate = service.getExpDate(poi);

    expect(expDate).toEqual(validDate);
  });

  it('expDate for TrafficJams', () => {
    const validDate = new Date('2016-11-04T16:57:11.718Z');
    validDate.setDate(validDate.getDate() + 1);
    const poi =       {
      id: "135892",
      type:  RoadHazardType.TrafficJams,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };

    const expDate = service.getExpDate(poi);

    expect(expDate).toEqual(validDate);
  });

  it('expDate for RoadEmergencies', () => {
    const validDate = new Date('2016-11-04T16:57:11.718Z');
    validDate.setDate(validDate.getDate() + 1);
    const poi =       {
      id: "135892",
      type:  RoadHazardType.RoadEmergencies,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };

    const expDate = service.getExpDate(poi);

    expect(expDate).toEqual(validDate);
  });

  it('expDate for RoadConditions', () => {
    const validDate = new Date('2016-11-04T16:57:11.718Z');
    validDate.setDate(validDate.getDate() + 1);
    const poi =       {
      id: "135892",
      type:  RoadHazardType.RoadConditions,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };

    const expDate = service.getExpDate(poi);

    expect(expDate).toEqual(validDate);
  });

  it('expDate for CamerasAndRadars', () => {
    const validDate = new Date('2016-11-04T16:57:11.718Z');
    validDate.setMonth(validDate.getMonth() + 6);
    const poi =       {
      id: "135892",
      type:  RoadHazardType.CamerasAndRadars,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };

    const expDate = service.getExpDate(poi);

    expect(expDate).toEqual(validDate);
  });

  it('expDate for Incidents', () => {
    const validDate = new Date('2016-11-04T16:57:11.718Z');
    validDate.setDate(validDate.getDate() + 1);
    const poi =       {
      id: "135892",
      type:  RoadHazardType.Incidents,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };

    const expDate = service.getExpDate(poi);

    expect(expDate).toEqual(validDate);
  });

  it('expDate for Potholes', () => {
    const validDate = new Date('2016-11-04T16:57:11.718Z');
    validDate.setMonth(validDate.getMonth() + 6);
    const poi =       {
      id: "135892",
      type:  RoadHazardType.Potholes,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "891eccb6ecbffff",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };

    const expDate = service.getExpDate(poi);

    expect(expDate).toEqual(validDate);
  });

  it('getPoitMap', () => {
    const cur = new Map<string, PointOfInterest[]>
    const poi1 =       {
      id: "135892",
      type:  RoadHazardType.Potholes,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "hex1",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };
    const poi2 =       {
      id: "135892",
      type:  RoadHazardType.Potholes,
      createdAt: new Date('2016-11-04T16:57:11.718Z'),
      hexId : "hex1",
      status: "Active",
      note : "mock_note",
      userId: 'user1'
    };
    cur.set("hex1", [poi1, poi2]);
    service.poiPerHex = cur;
    expect(service.getPoiMap()).toEqual(cur);
  })
});