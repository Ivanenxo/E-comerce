import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CatalogoComponent } from "./catalogo.component";
import { VarianteComponent } from "./variante/variante.component";
import { ProductosComponent } from "./productos_base/productos.component";
import { ItemcnfComponent } from "./itemcnf/itemcnf.component";

const routes: Routes = [
  {
    path: '',
    component: CatalogoComponent,
    children: [
      { path: '', redirectTo: 'variantes', pathMatch: 'full' },
      { path: 'variantes', component: VarianteComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'item', component: ItemcnfComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoRoutingModule {}
