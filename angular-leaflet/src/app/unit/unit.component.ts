import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Floor, Icon, Circle, Marker } from '../floor';
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
  fullSelectedFloor: Floor;
  private map;

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private unitService: UnitService,
              public sharedInfoService: SharedInfoService) { }

  ngOnInit() {
      this.route.paramMap.subscribe(paramMap => {
        this.sharedInfoService.setSearchBoxVisible(true);
        this.sharedInfoService.setSearchBoxTerm('');
        this.selectedFloor = undefined;
        this.fullSelectedFloor = undefined;

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
    }

    let floor = this.unitService.getFloor2(this.unit.id, this.selectedFloor.id);
    forkJoin([floor]).subscribe(results => {
      this.fullSelectedFloor = results[0];
      this.loadMap();
      // Observa searchBoxTerm$ para aplicar a pesquisa
      this.sharedInfoService.searchBoxTerm$.subscribe(searchBoxTerm => {
        this.searchOnMap(searchBoxTerm);
      });
    });
  }

  private loadMap() : void {
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

    this.map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -3
          });
  
    let bounds = [
      [0, 0],
      [814, 664]
    ]; 

    
    let layers = [];
    let layersByName = [];

    for (let category of this.fullSelectedFloor.categories) {
      let group = L.layerGroup();
      layers.push(group);
      if (category.title.trim().length > 0) {
        layersByName[category.title] = group; 
      }

      for (let marker of category.markers) {
        marker.getLMarker(L).addTo(group);
      }
    }

    L.imageOverlay(this.fullSelectedFloor.img, bounds).addTo(this.map);
    L.featureGroup(layers).addTo(this.map);
    this.map.fitBounds(bounds);
    L.control.layers(null, layersByName).addTo(this.map);
  } 

  private searchOnMap(value: string): void {
    this.fullSelectedFloor.searchAndHighlight(value);
  }

}
