import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Floor, AbstractMarker, IconMarker, CircleMarker } from '../floor';
import { UnitService } from '../unit.service';
import { Unit } from '../unit';
import { forkJoin } from 'rxjs';
import { SharedInfoService } from '../sharedinfo.service';
import { isNullOrUndefined } from 'util';
declare let L;

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  unit: Unit;
  floors: Floor[];
  selectedFloor: Floor;
  private map;
  private searchableMarkers = new Map();

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private unitService: UnitService,
              public sharedInfoService: SharedInfoService) { }

  ngOnInit() {
      this.route.paramMap.subscribe(paramMap => {
        this.sharedInfoService.setSearchBoxVisible(true);
        this.sharedInfoService.setSearchBoxTerm('');
        this.selectedFloor = undefined;

        let paramUnit = paramMap.get('unit');
        let unit = this.unitService.getUnit(paramUnit);
        let floors = this.unitService.getFloors(paramUnit);

        forkJoin([unit, floors]).subscribe(results => {
          this.unit = results[0];
          this.floors = results[1];
          
          if (paramMap.has('floor')) {
            let paramFloor = paramMap.get('floor');
            this.selectedFloor = this.floors.find(floor => floor.id === paramFloor);
          }
  
          if (isNullOrUndefined(this.selectedFloor)) {
            this.router.navigate(['/m', this.unit.id, this.floors[0].id]);  
          } else {
            this.loadFloorMap();
          }
        });
      });
  }

  private loadFloorMap(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.searchableMarkers.clear();
    }

    let floor = this.unitService.getFloor(this.unit.id, this.selectedFloor.id);
    forkJoin([floor]).subscribe(results => {
      this.loadMap(results[0]);
      // Observa searchBoxTerm$ para aplicar a pesquisa
      this.sharedInfoService.searchBoxTerm$.subscribe(searchBoxTerm => {
        this.searchOnMap(searchBoxTerm);
      });
    });
  }

  private loadMap(floor: Floor) : void {
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

    this.map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -3
          });
  
    let bounds = [
      [0, 0],
      [814, 664]
    ]; 

    let details = floor.details;
    let layers = [];
    let layersByName = [];
    let customLayer = L.layerGroup();
    layers.push(customLayer);

    if (!isNullOrUndefined(details.categorized)) {
      for (let category of details.categorized) {
        let group = L.layerGroup();
        layers.push(group);
        layersByName[category.title] = group; 
        this.processIconMarkers(category.iconMarkers, group);
        this.processCircleMarkers(category.circleMarkers, group);
      }
    }

    if (!isNullOrUndefined(details.uncategorized)) {
      this.processIconMarkers(details.uncategorized.iconMarkers, customLayer);
      this.processCircleMarkers(details.uncategorized.circleMarkers, customLayer); 
    }

    L.imageOverlay(details.img, bounds).addTo(this.map);
    L.featureGroup(layers).addTo(this.map);
    this.map.fitBounds(bounds);
    L.control.layers(null, layersByName).addTo(this.map);
  }

  private processIconMarkers(iconMarkers: IconMarker[], group: any) {
    if (isNullOrUndefined(iconMarkers)) {
      return;
    }

    for (let iconMarker of iconMarkers) {
      this.createMarkerFromIconMarker(iconMarker).addTo(group);
    }
  }

  private processCircleMarkers(circleMarkers: CircleMarker[], group: any) {
    if (isNullOrUndefined(circleMarkers)) {
      return;
    }

    for (let circleMarker of circleMarkers) {
      this.createMarkerFromCircleMarker(circleMarker).addTo(group);
    }
  }

  private createMarkerFromIconMarker(iconMarker: IconMarker) : any {
    let icon = L.AwesomeMarkers.icon({
      markerColor: iconMarker.markerColor,
      iconColor: iconMarker.iconColor,
      icon: iconMarker.icon
    });

    let marker = L.marker(iconMarker.latLng, {icon: icon});
    this.setOptionalMarkerAttrs(iconMarker, marker, true);    
    return marker;
  }

  private createMarkerFromCircleMarker(circleMarker: CircleMarker) : any {
    let marker = L.circle(circleMarker.latLng, {color: circleMarker.color, fillColor: circleMarker.fillColor, fillOpacity: circleMarker.fillOpacity, radius: circleMarker.radius});
    this.setOptionalMarkerAttrs(circleMarker, marker, false);
    return marker;
  }

  private setOptionalMarkerAttrs(src: AbstractMarker, dest: any, destHasOpacity: boolean) : void {
    let serachStr: string = '';
    if (!isNullOrUndefined(src.title) && src.title.trim() != '') {
      dest.bindTooltip(src.title, {permanent: !isNullOrUndefined(src.titlePermanent) ? src.titlePermanent : false});
      serachStr = src.title;      
    }
    if (!isNullOrUndefined(src.message)  && src.message.trim() != '') {
      dest.bindPopup(src.message);
    }

    if (destHasOpacity) {
      this.searchableMarkers.set(dest, serachStr.toLowerCase());
    }    
  }

  private searchOnMap(value: string): void {
    value = value.trim().toLowerCase(); 

    this.searchableMarkers.forEach((title: string, marker: any) => {
      let markerOpacity: number = 1;
      let tooltipOpacity: number = 0.9;
      if (value.length > 0 && title.indexOf(value) < 0) {
        markerOpacity = 0.2;  
        tooltipOpacity = 0.2;
      }

      marker.setOpacity(markerOpacity);
      if (!isNullOrUndefined(marker.getTooltip())) {
        marker.getTooltip().setOpacity(tooltipOpacity);
      }
    });
  }

}
