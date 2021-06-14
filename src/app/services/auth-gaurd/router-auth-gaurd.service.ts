import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginServiceService } from '../login-service/login-service.service';

@Injectable({
  providedIn: 'root'
})
export class RouterAuthGaurdService implements CanActivate {

  constructor(private loginService: LoginServiceService,
    public router: Router) { }
    
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.loginService.isUserAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
