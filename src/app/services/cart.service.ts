import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClienteService } from './cliente.service';
import { BehaviorSubject, Observable, Subject, switchMap } from 'rxjs';
import { API_URL } from './utils/Constants';

export interface CartItem {
  CodTercero: string | null;
  CodProducto: string;
  Cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartUpdatedSource = new Subject<void>();
  cartUpdated$ = this.cartUpdatedSource.asObservable();

  private apiUrl = API_URL+'api/Carrito/';
  private apiUrlMP = API_URL+'api/MercadoPago/'

   // 🔄 Cliente actual como observable reactivo
   private clienteSeleccionado$ = new BehaviorSubject<any>(null);


  constructor(private http:HttpClient, private clienteService:ClienteService) { // Suscripción al cliente del servicio global
    this.clienteService.clienteSeleccionado$.subscribe(cliente => {
      this.clienteSeleccionado$.next(cliente);
      console.log('🧠 Cliente actualizado en CartService:', cliente);
    });

    // Si hay cliente guardado en sessionStorage, restaurarlo
    const clienteGuardado = this.clienteService.getClienteSeleccionado();
    if (clienteGuardado) {
      this.clienteSeleccionado$.next(clienteGuardado);
    } }


  notifyCartUpdated(): void {
    this.cartUpdatedSource.next();
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

 // 🔄 Obtener ítems del carrito dependiendo del cliente seleccionado
 getItems(): Observable<CartItem[]> {
  return this.clienteSeleccionado$.pipe(
    switchMap(cliente => {
      if (!cliente || !cliente.Codigo) {
        console.warn('⚠️ No hay cliente seleccionado. Carrito vacío.');
        return new Observable<CartItem[]>(observer => {
          observer.next([]);
          observer.complete();
        });
      }

      const headers = this.getHeaders();
      return this.http.get<CartItem[]>(
        `${this.apiUrl}GetItems?CodigoCliente=${cliente.Codigo}`,
        { headers }
      );
    })
  );
}


  addItem(item: CartItem): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}AddItem`, item, { headers,
      responseType: 'text' });
  }


  descontarItem(item: CartItem): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}DescontarItem`, item, { headers });
  }


  updateItem(item: CartItem): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}UpdateItem`, item, { headers, responseType: 'text' });
  }

  cerrarcotizacion(productosSeleccionados: any, CodigoCliente: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}CrearOrden?CodigoCliente=${CodigoCliente}`, productosSeleccionados, { headers, responseType: 'json' });
  }

  crearPreferencia(documento: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrlMP}CrearPreferencia?DocumentoID=${documento}`;

    return this.http.post(url, null, { headers, responseType: 'text' }); // Enviar null como body
  }
}
