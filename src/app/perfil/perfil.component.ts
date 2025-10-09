import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {  CartService } from 'src/app/services/cart.service';
import { ClienteService } from '../services/cliente.service';
import { API_URL } from 'src/app/services/utils/Constants';
import Swal from 'sweetalert2';
import { ItemService } from '../services/item.service';


interface CartItem {
  Id: number;
  CodTercero: string;
  CodProducto: string;
  Cantidad: number;
  FechaAdd: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  apiUrl: string = API_URL;
  cartItems: any[] = [];
  cartVisible = false;
  selectedItems: { [key: string]: boolean } = {};

  onImageError(event: Event) {
    // Cambia el src de la imagen a una imagen alternativa en caso de error
    (event.target as HTMLImageElement).src = 'assets/Notfound.png';
  }

  selectedItem: any = null;

  user: any = null; // Inicializa la variable del usuario como null

  cliente: any;

  clientes: any[] = [];

  filtroCliente: string = '';


  constructor(private authService: AuthService, private router: Router, private cartService: CartService, private selectedItemService: ItemService, private clienteService: ClienteService ) { }


  selectItem(item: any) {
    this.router.navigate(['/buscar'])
    this.selectedItemService.setSelectedItem(item);
  }

  ngOnInit(): void {



    // Verifica si el usuario está autenticado
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.getUserInfo(); // Obtiene la información del usuario
    } else {
      // Si no está autenticado, redirige al login
      this.router.navigate(['/login']);
    }

    this.cartService.cartUpdated$.subscribe(() => {
      this.loadCart();
    });

    this.loadCart();

    this.clienteService.clienteSeleccionado$.subscribe(c => {
      this.cliente = c;
    });

    if (!this.cliente) {
      this.cliente = this.clienteService.getClienteSeleccionado();
    }

    this.clientes = this.clienteService.getClientes();

    this.clienteService.clientes$.subscribe(cs =>{
      this.clientes = cs;
    });




  }


  get clientesFiltrados() {
    const filtro = this.filtroCliente.toLowerCase();
    return this.clientes.filter(c =>
      c.NombreComercial.toLowerCase().includes(filtro) ||
      c.Ciudad.toLowerCase().includes(filtro)
    );
  }

  seleccionarCliente(cliente: any) {
    this.cliente = cliente;
    this.clienteService.setClienteSeleccionado(cliente);
  }


  goToTienda():void{
    this.selectedItemService.setSelectedItem(null);
    this.router.navigate(['/buscar'])
  }

  goToOrdenes(): void{
    this.router.navigate(['/ordenes']);
  }
  goToClientes(): void{
    this.router.navigate(['/listClient']);
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadCart(): void {
    this.cartService.getItems().subscribe(
      (items) => {
        this.cartItems = items;
      },
      (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    );
  }

  toggleCart(): void {
    this.cartItems.forEach(item => {
      this.selectedItems[item.Codigo] = true;
    });
    this.cartVisible = !this.cartVisible;
    this.loadCart();
  }

  get cartItemCount(): string {
    const totalItems = this.cartItems.reduce((sum: any, item: { Cantidad: any; }) => sum + item.Cantidad, 0);
    return totalItems > 9 ? '+9' : totalItems.toString();
  }

  calculateTotalPrice(item: any): number {
    return item.Cantidad * item.PrecioVenta;
  }

  calculateCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.Cantidad * item.PrecioVenta), 0);
  }

  deleteQuantity(item: any):void{
    const updatePayLoad ={
      CodTercero: this.cliente.Codigo,
      CodProducto: item.Codigo,
      Cantidad: item.Cantidad - item.Cantidad,
    };
    this.cartService.updateItem(updatePayLoad).subscribe({
      next:() =>{
        item.Cantidad;
        this.loadCart();
      },
      error: (error) =>{
        console.error('Error al decrecer')
      }
    })
  }

  onItemSelected(item: any): void {

    console.log("Seleccionado:", item.Codigo, this.selectedItems[item.Codigo, item.Cantidad]);

    console.log("Items seleccionaods:", this.selectedItems)
  }

  decreaseQuantity(item: any): void {

      const updatePayLoad ={
        CodTercero: this.cliente.Codigo,
        CodProducto: item.Codigo,
        Cantidad: item.Cantidad - 1,
      };
      this.cartService.updateItem(updatePayLoad).subscribe({
        next:() =>{
          item.Cantidad --;
          this.loadCart();
          console.log('Se decrecio');
        },
        error: (error) =>{
          console.error('Error al decrecer')
        }
      });

  }

  increaseQuantity(item: any): void {

    const updatePayLoad ={
      CodTercero: this.cliente.Codigo,
      CodProducto: item.Codigo,
      Cantidad: item.Cantidad + 1,
    };
    this.cartService.updateItem(updatePayLoad).subscribe({
      next:() =>{
        item.Cantidad++;
        console.log('Se incremento');
      },
      error: (error) =>{
        console.error('Error al incrementar')
      }
    });
  }

  updateQuantity(item: any): void {

    const updatePayLoad ={
      CodTercero: this.cliente.Codigo,
      CodProducto: item.Codigo,
      Cantidad: item.Cantidad,
    };
    if (item.Cantidad < 1) {
      item.Cantidad = 1; // Evitar valores menores a 1
    }
    this.cartService.updateItem(updatePayLoad).subscribe({
      next:() =>{
        item.Cantidad;
        console.log(item.Cantidad);
      }
    });
  }

  cerrarcotizacion(): void{
    console.log("se inicia cierre");
    var doc:string;

    const productosSeleccionados = this.cartItems
    .filter(item => this.selectedItems[item.Codigo]) // Solo los marcados
    .map(item => ({
      Codigo: item.Codigo,
      Cantidad: item.Cantidad
    }));

    console.log(productosSeleccionados)
  if (productosSeleccionados.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Ningún producto seleccionado',
      text: 'Debe seleccionar al menos un producto para cerrar la cotización.',
    });
    return;
  }

    this.cartService.cerrarcotizacion(productosSeleccionados).subscribe({
      next: (response) => {
        const doc= response.Documento?.IdDoc
        console.log('Cierre realizado con éxito', response.Documento?.IdDoc);
        this.loadCart();
        this.crearPreferenciaPago(doc);
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Cotizacion Cerrada',
        //   text: 'La cotizacion se ah completado puede verificar en sus cotizaciones',
        //   showConfirmButton: false,
        //   timer: 2000 // Alerta se cierra automáticamente después de 2 segundos
        // });

      },
      error: (error) => {
        console.error('Error al cerrar cotización', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al Cerrar la cotizacion. Por favor, intenta nuevamente.',
          footer: `<small>Detalles: ${error.message}</small>`
        });
      },
      complete: () => {
        console.log('Se finaliza cierre');
      },
    });

    //this.cartService.crearPreferencia


  }

  crearPreferenciaPago(doc: string): void {
    this.cartService.crearPreferencia(doc).subscribe({
      next: (response) => {
        const preferenceId = response; // Recibe el ID de la preferencia desde el backend
        console.log("Preferencia creada con éxito", preferenceId);

        // Mostrar SweetAlert con opciones
        Swal.fire({
          icon: 'success',
          title: 'Cotización cerrada',
          text: '¿Desea pagar ahora o seguir comprando?',
          showCancelButton: true,
          confirmButtonText: 'Pagar ahora',
          cancelButtonText: 'Seguir comprando',
          customClass: {
            confirmButton: 'bg-green-500 text-white px-4 py-2 rounded',
            cancelButton: 'bg-red-500 text-white px-4 py-2 rounded'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.abrirMercadoPago(preferenceId);
          }
        });
      },
      error: (error) => {
        console.error('Error al crear la preferencia de pago', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al generar la orden de pago. Por favor, intenta nuevamente.',
        });
      }
    });
  }

  abrirMercadoPago(preferenceId: string): void {
    const mp = new (window as any).MercadoPago('TEST-153b9f18-bfae-441f-bfef-140de9e9ddcc');

    mp.checkout({
      preference: {
        id: preferenceId
      },
      autoOpen: true, // Abrir automáticamente
    });
  }

}
