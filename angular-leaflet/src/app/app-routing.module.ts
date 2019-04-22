import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { UnitComponent }   from './unit/unit.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'm/:unit', component: UnitComponent },
  { path: 'm/:unit/:floor', component: UnitComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { 
  
}
