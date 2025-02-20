import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
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

  constructor(private http:HttpClient) { }

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

  getItems(): Observable<CartItem[]> {
    const headers = this.getHeaders();
    return this.http.get<CartItem[]>(`${this.apiUrl}GetItems`, { headers });
  }


  addItem(item: CartItem): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}AddItem/AddItem`, item, { headers,
      responseType: 'text' });
  }


  descontarItem(item: CartItem): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}DescontarItem/DescontarItem`, item, { headers });
  }


  updateItem(item: CartItem): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}UpdateItem/UpdateItem`, item, { headers, responseType: 'text' });
  }

  cerrarcotizacion(productosSeleccionados: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}CrearOrden`, productosSeleccionados, { headers, responseType: 'text' });
  }

}
