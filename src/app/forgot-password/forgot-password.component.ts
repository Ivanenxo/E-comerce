import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  step: number = 1;

  documento: string = '';
  pin: string = '';
  password: string = '';
  message: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Paso 1: solicitar PIN
  sendPin() {
    this.loading = true;
    this.authService.sendForgotPasswordPin(this.documento).subscribe({
      next: (res) => {
        this.message = res.message || 'PIN enviado correctamente';
        this.step = 2; // Avanzar al siguiente paso
        this.loading = false;
      },
      error: (err) => {
        this.message = err.error || 'Error al enviar el PIN';
        this.loading = false;
      }
    });
  }

  // Paso 2: cambiar contraseña
  changePassword() {
    this.loading = true;
    this.authService.changePassword(this.pin, this.documento, this.password).subscribe({
      next: (res) => {
        this.message = res.message || 'Contraseña cambiada con éxito';
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.message = err.error || 'Error al cambiar la contraseña';
        this.loading = false;
      }
    });
  }
}
