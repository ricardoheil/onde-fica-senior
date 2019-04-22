import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedInfoService {

    private searchBoxTerm = new Subject<string>();
    searchBoxTerm$ = this.searchBoxTerm.asObservable();

    private searchBoxVisible = new Subject<boolean>();
    searchBoxVisible$ = this.searchBoxVisible.asObservable();

    constructor() {
        console.log('SharedInfoService.constructor');
        this.setSearchBoxVisible(true);
        this.setSearchBoxTerm('');
    }

    setSearchBoxTerm(searchBoxTerm: string) {
        this.searchBoxTerm.next(searchBoxTerm);
    }

    setSearchBoxVisible(searchBoxVisible: boolean) {
        this.searchBoxVisible.next(searchBoxVisible);
    }

}