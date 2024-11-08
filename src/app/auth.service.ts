import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private validCredentials = { cedula: '1101691128', password: '123' };

  constructor() { }
  login(cedula: string, password: string): boolean {
    if (cedula === cedula && password === this.validCredentials.password) {
      localStorage.setItem('cedula', cedula);
      return true;
    }
    return false;
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
