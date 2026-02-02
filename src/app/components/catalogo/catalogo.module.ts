import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFormModule, DxPopupModule, DxTagBoxModule, DxSelectBoxModule, DxTabsModule  } from "devextreme-angular";
import { CatalogoRoutingModule } from "./catalogo-routing.module";
import { CatalogoComponent } from "./catalogo.component";
import { VarianteComponent } from "./variante/variante.component";
import { ProductosComponent } from "./productos_base/productos.component";
import { ItemcnfComponent } from './itemcnf/itemcnf.component';

@NgModule({
  declarations: [
    CatalogoComponent,
    VarianteComponent,
    ProductosComponent,
    ItemcnfComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CatalogoRoutingModule,

    // DevExtreme
    DxDataGridModule,
    DxPopupModule,
    DxFormModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTagBoxModule,
    DxSelectBoxModule,
    DxTabsModule
  ]
})
export class CatalogoModule {}
