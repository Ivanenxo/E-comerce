import { Component } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

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

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.aplicarFiltro();
  }

  clientes: Cliente[] = [
    {
      Codigo: "0000-111",
      NombreComercial: "ALFREDO LOPEZ",
      Ciudad: "BARRANQUILLA",
      TipoIdentificacion: "",
      Identificacion: "",
      NombreFiscal: "",
      Telefonos: "",
      Email: "",
      EmailFE: "",
      Vendedor: "V10"
    },
    {
      Codigo: "0000-111",
      NombreComercial: "ALFREDO LOPEZ",
      Ciudad: "BARRANQUILLA",
      TipoIdentificacion: "",
      Identificacion: "",
      NombreFiscal: "",
      Telefonos: "",
      Email: "",
      EmailFE: "",
      Vendedor: "V10"
    },
    {
      Codigo: "0000-111",
      NombreComercial: "ALFREDO LOPEZ",
      Ciudad: "BARRANQUILLA",
      TipoIdentificacion: "",
      Identificacion: "",
      NombreFiscal: "",
      Telefonos: "",
      Email: "",
      EmailFE: "",
      Vendedor: "V10"
    },
    {
      Codigo: "0000-111",
      NombreComercial: "ALFREDO LOPEZ",
      Ciudad: "BARRANQUILLA",
      TipoIdentificacion: "",
      Identificacion: "",
      NombreFiscal: "",
      Telefonos: "",
      Email: "",
      EmailFE: "",
      Vendedor: "V10"
    },
    {
      Codigo: "0000-111",
      NombreComercial: "ALFREDO LOPEZ",
      Ciudad: "BARRANQUILLA",
      TipoIdentificacion: "",
      Identificacion: "",
      NombreFiscal: "",
      Telefonos: "",
      Email: "",
      EmailFE: "",
      Vendedor: "V10"
    },
    {
      Codigo: "0000-111",
      NombreComercial: "ALFREDO LOPEZ",
      Ciudad: "BARRANQUILLA",
      TipoIdentificacion: "",
      Identificacion: "",
      NombreFiscal: "",
      Telefonos: "",
      Email: "",
      EmailFE: "",
      Vendedor: "V10"
    },
    {
      Codigo: "0000-112",
      NombreComercial: "EMPRESA XYZ",
      Ciudad: "CARTAGENA",
      TipoIdentificacion: "NIT",
      Identificacion: "900123456",
      NombreFiscal: "EMPRESA XYZ S.A.S.",
      Telefonos: "3001234567",
      Email: "contacto@xyz.com",
      EmailFE: "facturacion@xyz.com",
      Vendedor: "V05"
    }
  ];


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
