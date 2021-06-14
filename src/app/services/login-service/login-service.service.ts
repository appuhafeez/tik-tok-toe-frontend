import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginRequest } from 'src/app/common/request/login-request';
import { LoginResponse } from 'src/app/common/request/login-response';
import { RegisterRequest } from 'src/app/common/request/register-request';
import { RegisterResponse } from 'src/app/common/response/register-response';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../../services/storage-service/session-storage.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private baseUrl = environment.loginServerUrl;

  isAuthenticated: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient,
    private sessionStorage: SessionStorageService,
    private router: Router) { 

        if(sessionStorage.checkKeyExistedOrNot("refreshToken") && !this.isTokenExpired(sessionStorage.getDataFromStorage("refreshToken"))){
          this.isAuthenticated.next(true);
        }
    }

  isUserAuthenticated(): boolean {
    if(!this.sessionStorage.checkKeyExistedOrNot("refreshToken")){
      return false;
    }else{
      if(this.isTokenExpired(this.sessionStorage.getDataFromStorage("refreshToken"))){
        return false;
      }
      return true;
    }
  }

  getTokenExpirationDate(token: string): Date {

    let decoded: any;
    decoded = jwt_decode(token);

    console.log(`decoded token  ${decoded}`);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  loginUser(loginRequest: LoginRequest): Observable<HttpResponse<LoginResponse>> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/auth/token`, loginRequest, { observe: 'response' }).pipe(
      map(response => response)
    );
  }

  registerUser(registerRequest: RegisterRequest): Observable<HttpResponse<RegisterResponse>> {
    return this.httpClient.put<RegisterResponse>(`${this.baseUrl}/auth/register`, registerRequest, { observe: 'response' }).pipe(
      map(response => response)
    );
  }

  refreshToken(refreshToken: string): Observable<HttpResponse<LoginResponse>> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/auth/refresh?refreshToken=${refreshToken}`,null, { observe: 'response' }).pipe(
      map(response => response)
    );
  }

  pushAuthToken(isAuthenticated: boolean) {
    this.isAuthenticated.next(isAuthenticated);
  }

  regenerateTokenIfExpired(): boolean {
    if (this.sessionStorage.checkKeyExistedOrNot("accessToken") && this.isTokenExpired(this.sessionStorage.getDataFromStorage("accessToken"))) {
      this.refreshToken(this.sessionStorage.getDataFromStorage("refreshToken")).subscribe(response => {
        if (response.status === 200) {
          let tokenResponse = new LoginResponse();
          tokenResponse = response.body;
          this.sessionStorage.addDataToStorage("accessToken", tokenResponse.token);
          return true;
        } else {
          this.sessionStorage.deleteKeyFromStore("accessToken");
          this.sessionStorage.deleteKeyFromStore("refreshToken");
          this.sessionStorage.deleteKeyFromStore("user");
          this.sessionStorage.deleteKeyFromStore("authorities");
          this.router.navigateByUrl("/login?error=tokenExpired");
        }
      });
    } else {
      console.log("no token");
      return true;
    }
  }

}
