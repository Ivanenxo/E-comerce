import { Component } from '@angular/core';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent {

  orders = [
    {
      documentoID: '001',
      tipoDocumento: 'Factura',
      numeroDoc: 'F-0001',
      fecha: '2024-11-01',
      codigoCliente: 'C001',
      nombreCliente: 'Juan Pérez',
      total: 1500,
      estado: 'cotizado',
    },
    {
      documentoID: '002',
      tipoDocumento: 'Factura',
      numeroDoc: 'F-0002',
      fecha: '2024-11-05',
      codigoCliente: 'C002',
      nombreCliente: 'Ana Gómez',
      total: 2500,
      estado: 'pendiente',
    },
    {
      documentoID: '003',
      tipoDocumento: 'Nota Crédito',
      numeroDoc: 'NC-0001',
      fecha: '2024-11-10',
      codigoCliente: 'C003',
      nombreCliente: 'Luis Torres',
      total: 3200,
      estado: 'enviado',
    },
    {
      documentoID: '004',
      tipoDocumento: 'Factura',
      numeroDoc: 'F-0003',
      fecha: '2024-11-15',
      codigoCliente: 'C004',
      nombreCliente: 'Maria López',
      total: 800,
      estado: 'cerrada',
    },
  ];

  filter: string = 'cotizado';

  get filteredOrders() {
    if (this.filter === 'todas') {
      return this.orders;
    }
    return this.orders.filter((order) => order.estado === this.filter);
  }

  setFilter(filtro: string) {
    this.filter = filtro;
  }

}
