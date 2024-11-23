import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = API_URL+ 'api/Login/Autenticate';

  constructor(private http : HttpClient) { }
  login(cedula: string, password: string): Observable<any> {
    const body ={
      User : cedula,
      Password : password
    };
    console.log(body);
    return this.http.post<any>(this.apiUrl, body);

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
}
