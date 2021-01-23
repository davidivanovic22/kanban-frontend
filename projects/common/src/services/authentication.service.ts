import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

export interface IUserToken {
  username: string;
  roles: string[];
}



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userToken: any;
  private token: any;

  constructor(private http: HttpClient, private router: Router) {
    try {
      this.token = localStorage.getItem('userToken');
      this.userToken = jwt_decode(this.token);
    } catch (e) {
      console.error(e);
      console.error('Not logged in.');
    }
  }


  getAllUser() {
    this.http.get(`${environment.baseUrl}/user`, { responseType: 'json' }).subscribe(data => {
      console.log(data);
    });
  }

  login(username: string, password: string): void {
    this.http.post(`${environment.baseUrl}/login`, { username, password }, { responseType: 'text' }).subscribe(token => {
      console.log(token);
      if (token) {
        this.userToken = jwt_decode(token);
        this.token = token;
        localStorage.setItem('userToken', token);
        this.router.navigate(['upis-sati']);
      }
    });
  }

  logout(): void {
    this.userToken = undefined;
    this.token = '';
    localStorage.removeItem('userToken');
    this.router.navigate(['']);
  }

  get userRoles(): string[] {
    return this.userToken.roles;
  }

  get userJwtToken(): string {
    return this.token;
  }
  get isLoggedIn(): boolean {
    return !!this.userJwtToken;
  }

  isCEO(): boolean {
    return this.userRoles.includes('ROLE_CEO');
  }
  isScholar(): boolean {
    return this.userRoles.includes('ROLE_SCHOLAR');
  }
  isProjectManager(): boolean {
    return this.userRoles.includes('ROLE_PROJECT_MANAGER');
  }
}
