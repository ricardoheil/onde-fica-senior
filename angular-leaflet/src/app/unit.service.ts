import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Unit } from './unit';
import { Floor } from './floor';
import { UNITS, FLOORS } from './mock-units';

@Injectable({ providedIn: 'root' })
export class UnitService {

  constructor(private http: HttpClient) { }

  getUnits(): Observable<Unit[]> {
    return of(UNITS);
  }

  getUnit(id: string): Observable<Unit> {
    return of(UNITS.find(unit => unit.id === id));
  }

  getFloors(unit: string): Observable<Floor[]> {
    if (unit.length > 6) {
      return of(FLOORS);
    } 
    return of(FLOORS.slice(3, 5));
      
  }

  getFloor(unit: string, id: string): Observable<Floor> {
    const url = `./assets/f-${id}.json`;
    return this.http.get<Floor>(url).pipe(
      tap(_ => console.log(`fetched floor id=${id}`)),
      catchError(this.handleError<Floor>(`getFloor id=${id}`))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}