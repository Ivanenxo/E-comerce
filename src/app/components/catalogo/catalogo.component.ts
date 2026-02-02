import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';
import { CatalogoService } from 'src/app/services/catalogo.services';
import { Router } from '@angular/router';

interface Variante_View {
  Variante: Variante;
  Valores: Variante_valor[];
}
interface Variante{
  IdVariante: number;
  Nombre: string;
  Descripcion: string;
  Activo: number;
}
interface Variante_valor{
  IdValor: number;
  VarianteId: number;
  Valor: string;
  Activo: number;
}


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  @ViewChild('dataGrid', { static: false }) dataGrid!: DxDataGridComponent;

  dataSource: any;          // CustomStore
  popupVisible = false;

  constructor(
    private router: Router,
    private catalogoService: CatalogoService
  ) {}

  ngOnInit(): void {
    this.dataSource = new CustomStore({
      key: 'Variante.IdVariante',
      load: () => {
        return this.catalogoService.getVariantes().toPromise();
      }
    });
  }


  private async loadVariantes(loadOptions: any): Promise<any> {
    try {

    } catch (err) {
      console.error('Error loadVariantes:', err);
      throw err;
    }
  }

  insertVariante(values: any): Promise<any> {
    const payload = {
      variante: {
        nombre: values.Variante?.Nombre ?? values.Nombre,
        descripcion: values.Variante?.Descripcion ?? '',
        activo: values.Variante?.Activo ? 1 : 0
      },
      valores: []
    };

    return this.catalogoService.createVarianteCompleta(payload).toPromise();
  }

  form = {
    variante: {
      Nombre: '',
      Descripcion: '',
      Activo: true
    },
    valores: [] as any[]
  };

  openPopup() {

    console.log("Click");
    this.form = {
      variante: {
        Nombre: '',
        Descripcion: '',
        Activo: true
      },
      valores: []
    };
    this.popupVisible = true;
  }

  saveVariante() {
    if (!this.form.variante.Nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    const payload = {
      variante: {
        Nombre: this.form.variante.Nombre,
        Descripcion: this.form.variante.Descripcion,
        Activo: this.form.variante.Activo ? 1 : 0
      },
      valores: this.form.valores.map(v => ({
        Valor: v.Valor,
        Activo: 1
      }))
    };

    this.catalogoService.createVarianteCompleta(payload)
      .subscribe(() => {
        this.popupVisible = false;
        this.dataGrid.instance.refresh();
      });
  }

  onDetailContentReady(e: any, parentData: any) {
    const grid = e.component;

    // Evitar múltiples filas nuevas
    if (grid.getVisibleRows().some((r: any) => r.isNewRow)) {
      return;
    }

    // Agregar fila vacía al final
    grid.addRow();
  }

  onValorInserted(e: any, varianteId: number) {
    const payload = {
      VarianteId: varianteId,
      Valor: e.data.Valor,
      Activo: e.data.Activo ? 1 : 0
    };

    this.catalogoService.createVarianteValor(payload).subscribe();
  }



}
