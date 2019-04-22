import { Component, OnInit } from '@angular/core';
import { SharedInfoService } from '../sharedinfo.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  // Controla a visibilidade do input de pesquisa
  searchBoxVisible: boolean = false;

  constructor(public sharedInfoService: SharedInfoService) { }

  ngOnInit() {
    // Observa searchBoxVisible$ para controlar a visibilidade do input de pesquisa
    this.sharedInfoService.searchBoxVisible$.subscribe(searchBoxVisible => {
      this.searchBoxVisible = searchBoxVisible;
    });
  }

  onChangeSearchBox(value: string) : void {
    this.sharedInfoService.setSearchBoxTerm(value);
  }

}
