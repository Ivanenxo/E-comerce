import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ItemListComponent } from './components/item-list/item-list.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthService } from './services/auth.service';
import { DxDataGridModule } from 'devextreme-angular';
import { DxPopupModule } from 'devextreme-angular';
import { DxFormModule } from 'devextreme-angular';
import { DxButtonModule } from 'devextreme-angular';
import { DxCheckBoxModule } from 'devextreme-angular';
import { OrdenesComponent } from './components/ordenes/ordenes.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ListClientComponent } from './components/list-client/list-client.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { VarianteComponent } from './components/catalogo/variante/variante.component';
import { CatalogoModule } from './components/catalogo/catalogo.module';

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    LoginComponent,
    PerfilComponent,
    OrdenesComponent,
    ForgotPasswordComponent,
    ListClientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DxDataGridModule,
    DxPopupModule,
    DxFormModule,
    DxButtonModule,
    DxCheckBoxModule,
    FormsModule,
    AppRoutingModule,
    CatalogoModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
