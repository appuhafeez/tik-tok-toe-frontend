import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginRequest } from 'src/app/common/request/login-request';
import { LoginResponse } from 'src/app/common/request/login-response';
import { RegisterRequest } from 'src/app/common/request/register-request';
import { RegisterResponse } from 'src/app/common/response/register-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private baseUrl = environment.loginServerUrl;

  isAuthenticated: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) { }

  loginUser(loginRequest: LoginRequest) : Observable<HttpResponse<LoginResponse>>{
    return this.httpClient.put<LoginResponse>(`${this.baseUrl}/auth/token`,loginRequest,{observe:'response'}).pipe(
      map(response => response)
    );
  }

  registerUser(registerRequest: RegisterRequest) : Observable<HttpResponse<RegisterResponse>>{
    return this.httpClient.put<RegisterResponse>(`${this.baseUrl}/auth/register`,registerRequest,{observe:'response'}).pipe(
      map(response => response)
    );
  }

  pushAuthToken(isAuthenticated: boolean){
    this.isAuthenticated.next(isAuthenticated);
  }

}
