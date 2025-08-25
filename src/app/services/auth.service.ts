import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = API_URL+ 'api/Login';

  constructor(private http : HttpClient) { }
  login(cedula: string, password: string): Observable<any> {
    const body ={
      User : cedula,
      Password : password
    };
    console.log(body);
    return this.http.post<any>(`${this.apiUrl}/Autenticate`, body);

  }

  logout(): void {
    localStorage.clear();
  }

  getUserInfo(): any {
    const cedula = localStorage.getItem('cedula');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (cedula && token) {
      return { cedula, token, username};
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
