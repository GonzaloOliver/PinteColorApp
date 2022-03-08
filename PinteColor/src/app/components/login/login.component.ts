import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { IAuth } from '../../interfaces/auth.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth } from 'src/app/model/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorStatus: boolean = false;

  constructor(private router: Router, private api: LoginService) {}
  objetoLogin: IAuth = new Auth();

  ngOnInit(): void {
    this.checkLocalStorage();
  }

  onLogin() {
    this.api.loginByUsuario(this.objetoLogin).subscribe(
      (data) => {
        if (data.accessToken != '') {
          this.errorStatus = false;
          localStorage.setItem('userToken', data.accessToken);
          window.location.reload();
        }
      },
      (error) => (this.errorStatus = true)
    );
  }

  checkLocalStorage() {
    if (localStorage.getItem('userToken')) {
      this.router.navigate(['/home/dashboard']);
    }
  }
}
