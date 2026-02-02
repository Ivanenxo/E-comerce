import { Component, OnInit } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { CatalogoService } from 'src/app/services/catalogo.services';

export interface ProductoCatalogo {
  Codigo: string;
  Descripcion: string;
  NombreComercial: string;
  Marca: string;
  Referencia: string;
  ProductoBaseId: number;
  NombreBase: string;
  PrecioVenta01: number;
  PrecioVenta02: number;
  PrecioVenta03: number;
  PrecioVenta04: number;
  PrecioVenta05: number;
}

export interface ProductoBaseDetalle {
  IdProductoBase: number;
  NombreBase: string;
  Variantes: VarianteDetalle[];
}

export interface VarianteDetalle {
  VarianteId: number;
  NombreVariante: string;
  Valores: ValorVariante[];
}

export interface ValorVariante {
  ValorId: number;
  Valor: string;
}

export interface VarianteEditable {
  VarianteId: number;
  NombreVariante: string;
  ValoresDisponibles: ValorVariante[];
  ValorSeleccionado: number | null;
}

export interface ProductoBaseSimple {
  Id: number;
  Nombre: string;
  Linea: string;
}


@Component({
  selector: 'app-itemcnf',
  templateUrl: './itemcnf.component.html',
  styleUrls: ['./itemcnf.component.css']
})
export class ItemcnfComponent implements OnInit {

  productos: ProductoCatalogo[] = [];
detalleProductoBase?: ProductoBaseDetalle;

tabIndex = 0;

tabs = [
  { title: 'Información General' },
  { title: 'Precios' }
];


productosBase: ProductoBaseSimple[] = [];

variantesEditar: VarianteEditable[] = [];

popupEditarVisible = false;
popupDetalleVisible = false;
popupVisible = false;
popupTitle = 'Nuevo Producto Catálogo';


productoForm: ProductoCatalogo = {
  Codigo: '',
  Descripcion: '',
  NombreComercial:'',
  Marca: '',
  Referencia: '',
  ProductoBaseId: 0,   // 👈 CLAVE
  NombreBase: '',
  PrecioVenta01: 0,
  PrecioVenta02: 0,
  PrecioVenta03: 0,
  PrecioVenta04: 0,
  PrecioVenta05: 0
};


  constructor(private catalogoService: CatalogoService) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarProductosBase();
  }

  cargarProductosBase() {
    this.catalogoService.getProductosBaseSimple()
      .subscribe(resp => {
        this.productosBase = resp.map(p => ({
          ...p,
          Id: Number(p.Id)   // 🔥 AQUÍ ESTÁ LA MAGIA
        }));
      });
  }

  cargarProductos() {
    this.catalogoService.getProductosCatalogo().subscribe(resp => {
      this.productos = resp;
    });
  }

  nuevoProducto() {
    this.popupTitle = 'Nuevo Producto Catálogo';

    this.productoForm = {
      Codigo: '',
      Descripcion: '',
      NombreComercial:'',
      Marca: '',
      Referencia: '',
      ProductoBaseId: 0,
      NombreBase: '',
      PrecioVenta01: 0,
      PrecioVenta02: 0,
      PrecioVenta03: 0,
      PrecioVenta04: 0,
      PrecioVenta05: 0
    };


    this.variantesEditar = [];
    this.popupEditarVisible = true;
  }

  editarProducto = (e: any) => {
    const producto = e.row.data;

    console.log(producto)

    this.popupTitle = 'Editar Producto';

    this.productoForm = {
      ...producto,
      ProductoBaseId: Number(producto.ProductoBaseId)
    };

    const existe = this.productosBase
      .some(p => Number(p.Id) === this.productoForm.ProductoBaseId);

    console.log('ProductoBaseId:', this.productoForm.ProductoBaseId, 'Existe:', existe);

    if (!existe) {
      notify(
        `El Producto Base (${this.productoForm.ProductoBaseId}) no existe en el catálogo`,
        'warning',
        4000
      );
      this.productoForm.ProductoBaseId = 0;
    }

    this.popupEditarVisible = true;

    if (this.productoForm.ProductoBaseId) {
      this.cargarVariantes(this.productoForm.ProductoBaseId);
    }
  };

  cargarVariantes(productoBaseId: number) {
    this.catalogoService
      .getProductoBase(productoBaseId)
      .subscribe((resp: ProductoBaseDetalle) => {

        this.detalleProductoBase = resp;

        this.variantesEditar = resp.Variantes.map(v => {

          // 🔑 Valor que viene del producto (solo en edición)
          const valorTexto =
            (this.productoForm as any)?.Valores?.[v.NombreVariante];

          // 🔍 Buscar el ValorId correspondiente
          const valorEncontrado = v.Valores.find(
            val => val.Valor === valorTexto
          );

          return {
            VarianteId: Number(v.VarianteId),
            NombreVariante: v.NombreVariante,
            ValoresDisponibles: v.Valores.map(val => ({
              ...val,
              ValorId: Number(val.ValorId)
            })),
            ValorSeleccionado: valorEncontrado
              ? Number(valorEncontrado.ValorId)
              : v.Valores.length === 1
                ? Number(v.Valores[0].ValorId)
                : null
          };
        });
      });
  }



  onPopupShown() {
    this.productoForm = { ...this.productoForm };
  }

  guardarEdicion() {
    const payload = {
      Codigo: this.productoForm.Codigo,
      Descripcion: this.productoForm.Descripcion,
      NombreComercial: this.productoForm.NombreComercial,
      Marca: this.productoForm.Marca,
      Referencia: this.productoForm.Referencia,
      ProductoBaseId: this.productoForm.ProductoBaseId,

      VariantesValores: this.variantesEditar
        .filter(v => v.ValorSeleccionado != null)
        .map(v => ({
          VarianteId: v.VarianteId,
          ValorId: v.ValorSeleccionado
        }))
    };

    console.log('📦 PAYLOAD FINAL:', payload);

    this.catalogoService.createProductoCompleto(payload)
      .subscribe({
        next: (resp) => {
          console.log('✅ Producto guardado correctamente', resp);

          this.popupEditarVisible = false;
        },
        error: (err) => {
          console.error('❌ Error al guardar producto', err);
        }
      });
  }



  verDetalleProducto = (e: any) => {
    const producto = e.row.data;

    if (!producto.ProductoBaseId) {
      notify('Producto sin Producto Base', 'warning', 3000);
      this.popupDetalleVisible = true;
      return;
    }

    this.catalogoService
      .getProductoBase(producto.ProductoBaseId)
      .subscribe(resp => {
        this.detalleProductoBase = resp;
        this.popupDetalleVisible = true;
      });
  };

  mostrarValores(row: any): string {
    if (!row || !row.Valores) {
      return '';
    }

    return row.Valores.map((v: any) => v.Valor).join(', ');
  }

  guardarProducto() {
    console.log('📦 Producto Catálogo:', JSON.stringify(this.productoForm, null, 2));
    this.popupVisible = false;
  }

  onProductoBaseChange = (e: any) => {
    const productoBaseId = Number(e.value);

    if (!productoBaseId) {
      this.variantesEditar = [];
      return;
    }

    this.cargarVariantes(productoBaseId);
  };



}
