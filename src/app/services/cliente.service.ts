import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { API_URL } from './utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clienteSeleccionadoSource = new BehaviorSubject<any>(null);
  clienteSeleccionado$ = this.clienteSeleccionadoSource.asObservable();

  private clientesSource = new BehaviorSubject<any[]>([]);
  clientes$ = this.clientesSource.asObservable();

  private apiUrl = API_URL+'api/Carrito/';

  setClientes(clientes: any[]) {
    this.clientesSource.next(clientes);
    sessionStorage.setItem('clientes', JSON.stringify(clientes));
  }

  getClientes(): any[] {
    const guardados = sessionStorage.getItem('clientes');
    return guardados ? JSON.parse(guardados) : [];
  }

  setClienteSeleccionado(cliente: any) {
    this.clienteSeleccionadoSource.next(cliente);
    sessionStorage.setItem('clienteSeleccionado', JSON.stringify(cliente));
  }

  getClienteSeleccionado() {
    const guardado = sessionStorage.getItem('clienteSeleccionado');
    return guardado ? JSON.parse(guardado) : null;
  }

  limpiarCliente() {
    this.clienteSeleccionadoSource.next(null);
    sessionStorage.removeItem('clienteSeleccionado');
  }

}
