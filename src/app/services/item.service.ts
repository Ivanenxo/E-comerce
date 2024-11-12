import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
      return this.http.get<any>(url);
    }else{
      throw new Error('Usuario no autenticado');
    }
  }
}
