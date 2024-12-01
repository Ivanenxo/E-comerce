import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {  CartService } from 'src/app/services/cart.service';
import { API_URL } from 'src/app/services/utils/Constants';
import Swal from 'sweetalert2';


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

  onImageError(event: Event) {
    // Cambia el src de la imagen a una imagen alternativa en caso de error
    (event.target as HTMLImageElement).src = 'assets/Notfound.png';
  }



  user: any = null; // Inicializa la variable del usuario como null

  constructor(private authService: AuthService, private router: Router, private cartService: CartService) { }


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
  }

  goToTienda():void{
    this.router.navigate(['/buscar'])
  }

  goToOrdenes(): void{
    this.router.navigate(['/ordenes']);
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


  decreaseQuantity(item: any): void {

      const updatePayLoad ={
        CodTercero: localStorage.getItem('cedula'),
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
      CodTercero: localStorage.getItem('cedula'),
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
    if (item.Cantidad < 1) {
      item.Cantidad = 1; // Evitar valores menores a 1
    }
    this.cartService.updateItem(item);
  }

  cerrarcotizacion(): void{
    console.log("se inicia cierre");
    this.cartService.cerrarcotizacion().subscribe({
      next: (response) => {
        console.log('Cierre realizado con éxito', response);
        this.loadCart();
        Swal.fire({
          icon: 'success',
          title: 'Cotizacion Cerrada',
          text: 'Lacotizacion se ah completado puede verificar en sus cotizaciones',
          showConfirmButton: false,
          timer: 2000 // Alerta se cierra automáticamente después de 2 segundos
        });

      },
      error: (error) => {
        console.error('Error al cerrar cotización', error);
        // Maneja el error aquí
      },
      complete: () => {
        console.log('Se finaliza cierre');
      },
    });
  }

}
