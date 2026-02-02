import { Component, OnInit } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DxDataGridComponent } from 'devextreme-angular';
import { CatalogoService } from 'src/app/services/catalogo.services';

export interface Linea {
  IdLinea: number;
  Nombre: string;
  Descripcion: string;
  ProductosBase: ProductoBase[];
}

export interface ProductoBase {
  IdProductoBase: number;
  LineaId: number;
  NombreBase: string;
  Activo: number;
  NombreLinea: string;
  Variantes: VarianteProducto[];
}

export interface VarianteProducto {
  Id: number;
  ProductoBaseId: number;
  VarianteId: number;
  Orden: number;
  NombreVariante: string;
  Valores: VarianteValor[];
}

export interface VarianteValor {
  Id: number;
  ProductoBaseId: number;
  VarianteId: number;
  ValorId: number;
  Valor: string;
  Orden: number;
}

export interface VarianteApi {
  Variante: {
    IdVariante: number;
    Nombre: string;
    Descripcion: string;
    Activo: number;
  };
  Valores: VarianteValor[];
}

interface VarianteConfig {
  VarianteId: number;
  Nombre: string;
  Valores: any[];
  ValoresSeleccionados: number[];
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  dataSource: any[] = [];

  lineas: any[] = [];

variantesDisponibles: VarianteApi[] = [];
variantesSeleccionadas: number[] = []; // IdVariante seleccionados
variantesConfiguradas: VarianteConfig[] = [];

  popupProductoBaseVisible = false;

  productoBaseForm = {
    IdProductoBase: 0,
    LineaId: 0,
    NombreBase: '',
    Activo: true,
    VariantesSeleccionadas: [] as number[] // 🔥 CLAVE
  };

  popupProductoVisible = false;

  modoEdicion = false;
  productoBaseEditandoId: number | null = null;

  constructor(private productosService: CatalogoService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.productosService.getConfigSkus().subscribe(resp => {

      // Guardamos líneas para el select
      this.lineas = resp.map(l => ({
        IdLinea: l.IdLinea,
        Nombre: l.Nombre
      }));

      // Flatten productos base
      this.dataSource = resp.flatMap(l => l.ProductosBase);
    });

    this.productosService.getVariantes().subscribe(resp => {
      this.variantesDisponibles = resp; // 🔥 TAL CUAL VIENE DEL API
    });
  }


  onVariantesChanged = (e: any) => {
    // ⚠️ deferimos la lógica para evitar romper el render del TagBox
    setTimeout(() => {
      this.procesarVariantes(e.value);
    });
  };

  private procesarVariantes(seleccionadas: number[]) {

    // limpiar las que ya no están
    this.variantesConfiguradas = this.variantesConfiguradas.filter(v =>
      seleccionadas.includes(v.VarianteId)
    );


    console.log("Variantes configurada" + this.variantesConfiguradas)

    // agregar nuevas
    seleccionadas.forEach(id => {
      if (!this.variantesConfiguradas.some(v => v.VarianteId === id)) {
        const varianteApi = this.variantesDisponibles.find(
          v => v.Variante.IdVariante === id
        );

        if (!varianteApi) return;

        this.variantesConfiguradas.push({
          VarianteId: varianteApi.Variante.IdVariante,
          Nombre: varianteApi.Variante.Nombre,
          Valores: varianteApi.Valores,
          ValoresSeleccionados: []
        });
      }
    });
  }


  verVariantesSeleccionadas() {
    console.log(this.productoBaseForm.VariantesSeleccionadas);
  }

  openProductoBasePopup() {
    this.modoEdicion = false;
    this.productoBaseEditandoId = null;

    this.productoBaseForm = {
      IdProductoBase: 0,
      LineaId: 0,
      NombreBase: '',
      Activo: true,
      VariantesSeleccionadas: []
    };

    this.variantesConfiguradas = [];
    this.popupProductoBaseVisible = true;
  }

  openProductoPopup() {
    this.popupProductoVisible = true;
  }

  verDetalleProducto = (e: any) => {
    const producto = e.row.data;

    if (!producto.IdProductoBase || producto.IdProductoBase === 0) {
      this.mostrarWarning(producto);
      return;
    }

    console.log('Detalle producto:', producto);
  };

  saveProductoBase() {

    const payload = {
      LineaId: this.productoBaseForm.LineaId,
      NombreBase: this.productoBaseForm.NombreBase,
      Activo: true,
      Variantes: this.variantesConfiguradas.map(v => ({
        VarianteId: v.VarianteId,
        Valores: v.ValoresSeleccionados
      }))
    };

    console.log('📦 JSON Producto Base a guardar:');
    console.log(JSON.stringify(payload, null, 2));
  }

  mostrarWarning(producto: any) {
    notify(
      'Este producto no tiene Producto Base asignado',
      'warning',
      3000
    );
  }



  editarProductoBase = (e: any) => {
    const producto: ProductoBase = e.row.data;

    this.modoEdicion = true;
    this.productoBaseEditandoId = producto.IdProductoBase;

    // Form base
    this.productoBaseForm = {
      IdProductoBase: producto.IdProductoBase,
      LineaId: producto.LineaId,
      NombreBase: producto.NombreBase,
      Activo: true,
      VariantesSeleccionadas: producto.Variantes.map(v => v.VarianteId)
    };

    // Configurar variantes
    this.variantesConfiguradas = producto.Variantes.map(v => ({
      VarianteId: v.VarianteId,
      Nombre: v.NombreVariante,
      Valores: v.Valores,
      ValoresSeleccionados: v.Valores.map(val => val.ValorId)
    }));

    this.popupProductoBaseVisible = true;
  };
}

