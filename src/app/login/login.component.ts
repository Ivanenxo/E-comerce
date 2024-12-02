import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  cedula = '';
  password = '';
  loginError: boolean = false;


  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    
    this.authService.login(this.cedula, this.password).subscribe(
      (response) => {

        const token = response.Token;
        const cedula = response.User;
        const userName = response.Nombre;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('cedula', cedula);
          localStorage.setItem('username',userName);
          this.router.navigate(['/buscar']);
        console.log('Login Sucefull');
        }

        console.log('Login exitoso:', token);
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
      }
    );
  }

}
