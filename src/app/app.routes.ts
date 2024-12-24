import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

import LoginComponent from './auth/login/login.component';
import ProductosComponent from './componentes/productos/productos.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
                children: [
                    { path: '', component:DashboardComponent },

                ]
  },
  { path: 'auth', component:LoginComponent},

 {path:'dashboard', component:ProductosComponent}




];
