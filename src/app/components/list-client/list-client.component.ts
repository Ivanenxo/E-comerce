import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { API_URL } from 'src/app/services/utils/Constants';

interface Cliente {
  Codigo: string;
  NombreComercial: string;
  Ciudad: string;
  TipoIdentificacion?: string;
  Identificacion?: string;
  NombreFiscal?: string;
  Telefonos?: string;
  Email?: string;
  EmailFE?: string;
  TipoCliente?: string;
  Vendedor?: string;
}

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css']
})
export class ListClientComponent implements OnInit {
  @ViewChild('dataGrid', { static: false }) dataGrid!: DxDataGridComponent;

  clientes: Cliente[] = []; // cache local
  dataSource: any;          // CustomStore
  ciudadFiltro = '';
  tipoClienteFiltro = '';
  vendedorFiltro = '';

  private apiUrl = API_URL + 'api/Carrito/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    // Configurar el CustomStore que DevExtreme usará para cargar los datos
    this.dataSource = new CustomStore({
      key: 'Codigo',
      load: (loadOptions: any) => this.loadClientes(loadOptions)
    });
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private async loadClientes(loadOptions: any): Promise<any> {
    try {
      const headers = this.getHeaders();
      const url = `${this.apiUrl}GetClientes`;
      const clientes = await this.http.get<Cliente[]>(url, { headers }).toPromise();

      this.clientes = clientes || [];

      // 🔹 Guarda la lista en el servicio para que otros componentes puedan acceder
      this.clienteService.setClientes(this.clientes);

      // 🔹 Aplicar filtros externos si existen
      let resultado = this.clientes;

      if (this.ciudadFiltro) {
        resultado = resultado.filter(c => c.Ciudad === this.ciudadFiltro);
      }
      if (this.tipoClienteFiltro) {
        resultado = resultado.filter(c => c.TipoCliente === this.tipoClienteFiltro);
      }
      if (this.vendedorFiltro) {
        resultado = resultado.filter(c => c.Vendedor === this.vendedorFiltro);
      }

      return {
        data: resultado,
        totalCount: resultado.length
      };
    } catch (err) {
      console.error('Error loadClientes:', err);
      throw err;
    }
  }

  // Cuando el usuario hace clic en una fila del grid
  onRowClick(e: any): void {
    const cliente: Cliente = e.data;
    this.seleccionarCliente(cliente);
  }

  seleccionarCliente(cliente: Cliente): void {
    // 🔹 Guarda el cliente seleccionado en el servicio compartido
    this.clienteService.setClienteSeleccionado(cliente);

    console.log('Cliente seleccionado:', cliente);
    this.router.navigate(['/buscar']); // redirige al componente de búsqueda
  }

  aplicarFiltrosExternos(): void {
    if (this.dataGrid?.instance) {
      this.dataGrid.instance.refresh(); // recarga desde CustomStore
    }
  }

  onContentReady(e: any): void {
    const data = this.dataGrid.instance.getDataSource().items();

    if (Array.isArray(data)) {
      this.clienteService.setClientes(data);
      console.log(`📤 ${data.length} clientes filtrados enviados al servicio`);
    } else {
      this.clienteService.setClientes([]);
      console.log('⚠️ Lista vacía (sin resultados)');
    }
  }

  // 🔹 Getters seguros para llenar selects (sin errores de tipo)
  get ciudadesDisponibles(): string[] {
    return Array.from(new Set(
      this.clientes
        .map(c => c.Ciudad)
        .filter((v): v is string => !!v)
    ));
  }

  get tiposClientesDisponibles(): string[] {
    return Array.from(new Set(
      this.clientes
        .map(c => c.TipoCliente)
        .filter((t): t is string => !!t)
    ));
  }

  get vendedoresDisponibles(): string[] {
    return Array.from(new Set(
      this.clientes
        .map(c => c.Vendedor)
        .filter((v): v is string => !!v)
    ));
  }
}
