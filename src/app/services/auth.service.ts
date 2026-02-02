import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = API_URL+ 'api/Login';

  isLogged = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem('cedula');
  }


  login(cedula: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Autenticate`, {
      User: cedula,
      Password: password
    });
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.isLogged = false;
  }

  getUserInfo(): any {
    const cedula = localStorage.getItem('cedula');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const rol = localStorage.getItem('rol')
    if (cedula && token) {
      return { cedula, token, username, rol};
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('cedula');
  }

  getCedula(): string | null {
    return localStorage.getItem('cedula');
  }

  sendForgotPasswordPin(documento: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/SendForgotPasswordPin`, `"${documento}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Cambiar contraseña con PIN
  changePassword(pin: string, documento: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/ChangePassword?pin=${pin}&documento=${documento}&password=${password}`,
      {}
    );
  }

}
