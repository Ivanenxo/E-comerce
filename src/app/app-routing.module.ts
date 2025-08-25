import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { OrdenesComponent } from './components/ordenes/ordenes.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgotPassword', component : ForgotPasswordComponent},
  { path: 'buscar', component: ItemListComponent , canActivate: [AuthGuard] },
  { path: 'ordenes', component: OrdenesComponent},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
