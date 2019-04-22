export class Floor {
    id: string;
    name: string;
    details?: FloorDetail;
}

export interface AbstractMarker {
    title?: string;
    titlePermanent?: boolean;    
    message?: string;
    latLng: number[];
}

export interface IconMarker extends AbstractMarker {
    markerColor: string;
    iconColor: string;
    icon: string;
}

export interface CircleMarker extends AbstractMarker {
    color: string;
    fillColor: string;
    fillOpacity: number;
    radius: number;
}

export interface Category {
    title: string;
    iconMarkers?: IconMarker[];
    circleMarkers?: CircleMarker[];
}

export interface MarkerGroup {
    iconMarkers?: IconMarker[];
    circleMarkers?: CircleMarker[];
}

export interface FloorDetail {
    img: string;
    categorized?: Category[];
    uncategorized?: MarkerGroup;
}
