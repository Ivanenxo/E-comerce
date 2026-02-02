import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, delay, finalize, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { API_URL } from './utils/Constants';
import { ProductoBaseDetalle, ProductoBaseSimple } from '../components/catalogo/itemcnf/itemcnf.component';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private apiUrl = API_URL+ 'api/Variantes/';

  private selectedItemSource = new BehaviorSubject<any>(null);
  selectedItem$ = this.selectedItemSource.asObservable();

  constructor(private http: HttpClient) { }



  getVariantes(): Observable<any> {
    const token = localStorage.getItem('token');
    if(token){
      const url = `${this.apiUrl}GetVariantes`;


      return this.http.get<any>(url).pipe(delay(2000),tap(() => console.log('Datos Cargados completamente')),
      finalize(() => console.log('Carga de datos Finalizada ')));
    }else{
      throw new Error('Usuario no autenticado');
    }
  }

  updateVarianteCompleta(data: any) {
    return this.http.put(`${this.apiUrl}UpdateVariante`, data);
  }


  createVarianteCompleta(data: any) {
    return this.http.post(`${this.apiUrl}CreateVarianteCompleta`, data);
  }

  createVarianteValor(data: any) {
    return this.http.post(`${this.apiUrl}CreateVarianteValor`, data);
  }

  getConfigSkus() {
    return this.http.get<any[]>(`${this.apiUrl}GetConfigSKUs`);
  }

  getProductoBase(Prodid: number) {
    return this.http.get<ProductoBaseDetalle>(
      `${this.apiUrl}GetProductoBase?ProductoBaseId=${Prodid}`
    );
  }

  getProductosCatalogo() {
    return this.http.get<any[]>(
      `${this.apiUrl}GetProductosCatalogo`
    );
  }

  getProductosBaseSimple() {
    return this.http.get<ProductoBaseSimple[]>(

      `${this.apiUrl}GetProductosBase`
    );
  }

  createProductoCompleto(data: any) {
    return this.http.post(`${this.apiUrl}AddProdutoVariantesValores`, data);
  }

}
