import { isNullOrUndefined } from 'util';
export class Floor {
    id: string;
    name: string;
    img?: string;
    categories?: Category[];

    searchAndHighlight?(title: string): void {
        if (isNullOrUndefined(this.categories)) {
            return;
        }

        let value = title.trim().toLowerCase(); 
        for (let category of this.categories) {
            for (let marker of category.markers) {
                if (value.length > 0 && (isNullOrUndefined(marker.title) || marker.title.toLowerCase().indexOf(value) < 0)) {
                    marker.hide();
                } else {
                    marker.show();
                }
            }
        }
    }

    static createFromJSON(json: any): Floor {
        let result: Floor = new Floor();
        Object.assign(result, json); 

        result.categories = [];
        if (!isNullOrUndefined(json.categories)) {
            for (let item of json.categories) {
                result.categories.push(Category.createFromJSON(item));
            }
        }
        return result;
    }   
}

export class Category {
    title: string;
    markers: Marker[];

    static createFromJSON(json: any): Category {
        let result: Category = new Category();
        Object.assign(result, json);  

        result.markers = [];
        if (!isNullOrUndefined(json.markers)) {
            for (let item of json.markers) {
                result.markers.push(Marker.createFromJSON(item));
            }
        }
        return result;
    }
}

export class Marker {
    title?: string;
    titlePermanent?: boolean;    
    message?: string;
    shape: Shape;

    private LMarker;
    getLMarker(L: any): any {
        if (isNullOrUndefined(this.LMarker)) {
            this.LMarker = this.shape.createLMarker(L);
            if (!isNullOrUndefined(this.title) && this.title.trim() != '') {
                this.LMarker.bindTooltip(this.title, {permanent: !isNullOrUndefined(this.titlePermanent) ? this.titlePermanent : false}); 
            }
            if (!isNullOrUndefined(this.message)  && this.message.trim() != '') {
                this.LMarker.bindPopup(this.message);
            }  
        }
        return this.LMarker;
    }

    show(): void {
        this.shape.show(this.LMarker);
    }

    hide(): void {
        this.shape.hide(this.LMarker);
    }

    static createFromJSON(json: any): Marker {
        let result: Marker = new Marker();
        Object.assign(result, json);  

        if (!isNullOrUndefined(json.icon)) {
            result.shape = Icon.createFromJSON(json.icon);
        } else if (!isNullOrUndefined(json.circle)) {
            result.shape = Circle.createFromJSON(json.circle);
        } else if (!isNullOrUndefined(json.rectangle)) {
            result.shape = Rectangle.createFromJSON(json.rectangle);
        } else if (!isNullOrUndefined(json.polygon)) {
            result.shape = Polygon.createFromJSON(json.polygon);
        } else {
            result.shape = null;
        }
        return result;
    }
}

export abstract class Shape {
    static defaultOpacity: number = 1;
    static defaultTooltipOpacity: number = 0.9;
    static invisibleOpacity: number = 0.2;    
    latLng: any;
    color: string;

    abstract createLMarker(L: any): any;
    
    protected setVisible(LMarker: any, visible: boolean): void {
        let marker: number = visible ? Shape.defaultOpacity : Shape.invisibleOpacity;
        let tooltip: number = visible ? Shape.defaultTooltipOpacity : Shape.invisibleOpacity;

        LMarker.setOpacity(marker);
        if (!isNullOrUndefined(LMarker.getTooltip())) {
            LMarker.getTooltip().setOpacity(tooltip);
        }
    }

    show(LMarker: any): void {
        this.setVisible(LMarker, true);
    }

    hide(LMarker: any): void {
        this.setVisible(LMarker, false);
    }
}

export abstract class FilledShape extends Shape {
    static defaultFillOpacity: number = 0.5;
    static defaultWeight: number = 1;
    
    protected setVisible(LMarker: any, visible: boolean): void {
        let marker: number = visible ? Shape.defaultOpacity : Shape.invisibleOpacity;
        let fill: number = visible ? FilledShape.defaultFillOpacity : Shape.invisibleOpacity;
        let tooltip: number = visible ? Shape.defaultTooltipOpacity : Shape.invisibleOpacity;

        LMarker.setStyle({ opacity: marker, fillOpacity: fill });
        if (!isNullOrUndefined(LMarker.getTooltip())) {
            LMarker.getTooltip().setOpacity(tooltip);
        }
    }
}

export class Icon extends Shape {
    iconColor: string;
    icon: string;

    createLMarker(L: any): any {
        let icon = L.AwesomeMarkers.icon({
            markerColor: this.color,
            iconColor: this.iconColor,
            icon: this.icon
        });        
        return L.marker(this.latLng, {icon: icon});
    }

    static createFromJSON(json: any): Icon {
        let result: Icon = new Icon();
        Object.assign(result, json);  
        return result;   
    }
}

export class Circle extends FilledShape {
    radius: number;

    createLMarker(L: any): any {    
        return L.circle(this.latLng, {
            weight: FilledShape.defaultWeight,
            fillColor: this.color, 
            fillOpacity: FilledShape.defaultFillOpacity, 
            radius: this.radius
        });
    }

    static createFromJSON(json: any): Circle {
        let result: Circle = new Circle();
        Object.assign(result, json);  
        return result;   
    }    
}

export class Rectangle extends FilledShape {
    createLMarker(L: any): any {    
        return L.rectangle(this.latLng, {
            weight: FilledShape.defaultWeight,
            fillColor: this.color, 
            fillOpacity: FilledShape.defaultFillOpacity
        });
    }

    static createFromJSON(json: any): Rectangle {
        let result: Rectangle = new Rectangle();
        Object.assign(result, json);  
        return result;   
    }    
}

export class Polygon extends FilledShape {
    createLMarker(L: any): any {    
        return L.polygon(this.latLng, {
            weight: FilledShape.defaultWeight,
            fillColor: this.color, 
            fillOpacity: FilledShape.defaultFillOpacity
        });
    }

    static createFromJSON(json: any): Polygon {
        let result: Polygon = new Polygon();
        Object.assign(result, json);  
        return result;   
    }    
}