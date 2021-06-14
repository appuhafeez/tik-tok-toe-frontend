import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../storage-service/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService implements HttpInterceptor {

  constructor(private storageService: SessionStorageService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const securedEndpoints = [`${environment.securedEndpoint}`,`${environment.securedEndpoint2}`];
    if (securedEndpoints.some(url => req.urlWithParams.includes(url))) {
      if (this.storageService.checkKeyExistedOrNot("accessToken")) {
        let accessToken = this.storageService.getDataFromStorage("accessToken");
        console.log(` adding access token : ${accessToken}  , url ${req.urlWithParams}`);
        req = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + accessToken
          }
        });
        console.log(`complete request :: `+ JSON.stringify(req));
      }
    }
    return next.handle(req).toPromise();
  }
}
