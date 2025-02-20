import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {

  constructor(private http: HttpClient) { }

  // Método para obtener el preference_id desde el backend
  getPreference(): Observable<any> {
    return this.http.get('http://tusitio.com/api/mercado-pago/preference');
  }
}
