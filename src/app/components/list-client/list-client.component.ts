import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteService } from 'src/app/services/cliente.service';
import { API_URL } from 'src/app/services/utils/Constants';

interface Cliente {
  Codigo: string;
  NombreComercial: string;
  Ciudad: string;
  TipoIdentificacion: string;
  Identificacion: string;
  NombreFiscal: string;
  Telefonos: string;
  Email: string;
  EmailFE: string;
  Vendedor: string;
}

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css']
})
export class ListClientComponent {

  constructor(private clienteService: ClienteService,private http:HttpClient) {}

  ngOnInit(): void {
    this.aplicarFiltro();
    this.cargarClientes();
  }

  private apiUrl = API_URL+'api/Carrito/';


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

  getListClient(): Observable<Cliente[]> {
    const headers = this.getHeaders();

    return this.http.get<Cliente[]>(
      `${this.apiUrl}GetItems`,
      { headers }
    );
  }

  cargarClientes(): void {
    this.getListClient().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrado = [...this.clientes];
        this.clienteService.setClientes(this.clientes); // compartir lista
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
      }
    });
  }



  clientes: Cliente[] = [];
  ciudadFiltro: string = '';
  clienteSeleccionado?: Cliente;
  clientesFiltrado: Cliente[] = [];

  get ciudadesDisponibles(): string[] {
    return [...new Set(this.clientes.map(c => c.Ciudad))];
  }

  get clientesFiltrados(): Cliente[] {
    if (!this.ciudadFiltro) return this.clientes;
    return this.clientes.filter(c => c.Ciudad === this.ciudadFiltro);
  }



  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.clienteService.setClienteSeleccionado(cliente);
    console.log('Cliente seleccionado:', cliente);
  }

  aplicarFiltro(): void {
    if (this.ciudadFiltro) {
      this.clientesFiltrado = this.clientes.filter(c => c.Ciudad === this.ciudadFiltro);
    } else {
      this.clientesFiltrado = [...this.clientes];
    }

    this.clienteService.setClientes(this.clientesFiltrado);

  }

}
