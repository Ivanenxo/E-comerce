import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service';
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


  constructor(private authService: AuthService, private router: Router, private clienteService: ClienteService) {}

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
          localStorage.setItem('rol', response.Rol)

          if(response.Rol == 'Cliente'){

            const cliente = {
              Codigo: cedula,
              NombreComercial: userName,
              Ciudad: response.Ciudad || '',
              TipoIdentificacion: response.TipoIdentificacion || '',
              Identificacion: response.Identificacion || '',
              NombreFiscal: response.NombreFiscal || '',
              Telefonos: response.Telefonos || '',
              Email: response.Email || '',
              EmailFE: response.EmailFE || '',
              Vendedor: response.Vendedor || ''
            };

            this.clienteService.setClienteSeleccionado(cliente);

            this.router.navigate(['/buscar']);
          }else if(response.Rol == 'Empleado') {
            this.router.navigate(['/listClient']);
          }

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
