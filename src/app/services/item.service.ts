import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, delay, finalize, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { API_URL } from './utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = API_URL+ 'api/Catalogo/GetByKeyWords';

  private apiUrl2 = API_URL+ 'api/Catalogo';

  private selectedItemSource = new BehaviorSubject<any>(null);
  selectedItem$ = this.selectedItemSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  setSelectedItem(item: any) {
    this.selectedItemSource.next(item);
  }

  getItems(param2: string, param3 : string): Observable<any> {
    const token = localStorage.getItem('token');
    if(token){
      const url = `${this.apiUrl}/GetFavorites?CodigoCliente=${param3}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get<any>(url, {headers}).pipe(delay(2000),tap(() => console.log('Datos Cargados completamente')),
      finalize(() => console.log('Carga de datos Finalizada ')));
    }else{
      throw new Error('Usuario no autenticado');
    }
  }

  getItemsFav(param2: string, ): Observable<any> {
    const token = localStorage.getItem('token');
    if(token){
      const url = `${this.apiUrl2}/GetFavorites?CodigoCliente=${param2}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get<any>(url, {headers}).pipe(delay(2000),tap(() => console.log('Datos Cargados completamente')),
      finalize(() => console.log('Carga de datos Finalizada ')));
    }else{
      throw new Error('Usuario no autenticado');
    }
  }
}
