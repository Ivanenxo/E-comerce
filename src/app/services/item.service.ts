import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    if(cedula){
      const url = `${this.apiUrl}/${cedula}/${param2}`;
      return this.http.get<any>(url).pipe(delay(2000),tap(() => console.log('Datos Cargados completamente')),
      finalize(() => console.log('Carga de datos Finalizada ')));
    }else{
      throw new Error('Usuario no autenticado');
    }
  }
}
