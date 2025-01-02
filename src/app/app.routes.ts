import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

import LoginComponent from './auth/login/login.component';
import ProductosComponent from './componentes/productos/productos.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { ProveedoresComponent } from './componentes/proveedores/proveedores.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { ReportesComponent } from './componentes/reportes/reportes.component';
import { UsersComponent } from './componentes/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginRedirectGuard } from './guards/login-redirect.guard';
import { LoteComponent } from './componentes/lote/lote.component';

export const routes: Routes = [
  { path: '', component:LoginComponent, canActivate: [LoginRedirectGuard]},

  {
    path: 'dashboard',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
                children: [
                    { path: '', component:DashboardComponent },
                    {path:'productos', component:ProductosComponent},
                    {path:'proveedores', component:ProveedoresComponent},
                    {path:'reportes', component:ReportesComponent},
                    {path:'usuarios', component:UsersComponent},
                    {path:'lote', component:LoteComponent}

                ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];
