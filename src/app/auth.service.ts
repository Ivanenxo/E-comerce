import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://services.matrixsql.com:8008/api/Login/Autenticate';

  constructor(private http : HttpClient) { }
  login(cedula: string, password: string): Observable<any> {
    const body ={
      User : cedula,
      Password : password
    };
    return this.http.post<any>(this.apiUrl, body);

  }

  logout(): void {
    localStorage.removeItem('cedula');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('cedula');
  }

  getCedula(): string | null {
    return localStorage.getItem('cedula');
  }
}
