import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { AuthService } from '../auth.service';
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
    const isAuthenticated = this.authService.login(this.cedula, this.password);
    if (isAuthenticated) {
      this.router.navigate(['/buscar']);
      console.log('Login Sucefull')
    } else {
      this.loginError = true;
    }
  }

}
