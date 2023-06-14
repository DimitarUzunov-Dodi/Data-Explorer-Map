# Data Explorer Map

## Description

Data Explorer Map is Web Tool for visual representation of data that was submitted by vehicles driving on the road across the globe. It aims to provide a tool for visual representation of data that was created by vehicles driving on the road across the globe.

## Installation
-  Make sure you have Node.js and npm (Node Package Manager) installed on your system. You can download them from the official Node.js website: https://nodejs.org 
- Open a command-line interface and navigate to the directory where you have the project downloaded.
- Install Angular CLI: 
```
npm install -g @angular/cli
```
## Usage
- Navigate to the project directory: 
```
cd my-angular-project
```
- Install project dependencies: 
```
npm install
```
- Run the Angular development server: 
```
ng serve
```
- Access the application: After the development server has started, open a web browser and navigate to http://localhost:4200.

## Testing
- Run tests:
```
ng test
```
- Run pipeline for checkstyle:
```
npx eslint --ext .ts . --fix
```

## Dependencies
- Google Maps API: used to visualize map and for Geocoder
- H3-js: used to create and visualize hexagons over the map.

## Usage
- Each displayed Hexagon represents a reported hazard or a point of interest inside the region the hexagon is on.
- Hovering over a hexagon will display a pop-up showing all the unique types of hazards.
- Clicking a hexagon will show an infotainment panel with further information for the hexagon.
- Searching for hexagon will show an infotainment panel with further information for the hexagon.
- Searching for a hazard will show an infotainment panel with further information for the hazard.
- Searching for a user will show an infotainment panel with further information for the user.
- Searching for a region will show an infotainment panel with further information for the region.
- Hexagons can be fittered so that only hexagon with certain point of interests will be visualized.
- Users can navigate between searches and infotainment panels throught the back and forward buttons inside the infotainment panels.