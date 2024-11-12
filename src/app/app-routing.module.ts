import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'buscar', component: ItemListComponent , canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
