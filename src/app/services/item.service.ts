import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { delay, finalize, Observable, tap } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = 'https://services.matrixsql.com:8008/api/Catalogo/GetByKeysWord';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getItems(param2: string): Observable<any> {
    const cedula = this.authService.getCedula();
    const token = localStorage.getItem('token');
    if(cedula && token){
      const url = `${this.apiUrl}/${cedula}/${param2}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get<any>(url).pipe(delay(2000),tap(() => console.log('Datos Cargados completamente')),
      finalize(() => console.log('Carga de datos Finalizada ')));
    }else{
      throw new Error('Usuario no autenticado');
    }
  }
}
