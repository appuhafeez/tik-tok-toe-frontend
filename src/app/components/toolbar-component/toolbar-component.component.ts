import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { LoginServiceService } from '../../services/login-service/login-service.service';


@Component({
  selector: 'app-toolbar-component',
  templateUrl: './toolbar-component.component.html',
  styleUrls: ['./toolbar-component.component.css']
})
export class ToolbarComponentComponent implements OnInit {

  isAuthenticated:boolean;

  faGithub = faGithub;
  faInstagram = faInstagram;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faEllipsisV = faEllipsisV;
  gitHubUrl: string = environment.gitHubUrl;
  instagramUrl: string = environment.instagramUrl;
  linkedInUrl: string = environment.linkedInUrl;
  twitterUrl: string = environment.twitterUrl;
  isSmallScreen: boolean
  constructor(private sanitizer: DomSanitizer,
    private loginService: LoginServiceService) { }

  ngOnInit(): void {
    if(window.screen.width <= 420){
      this.isSmallScreen = true;
    }else{
      this.isSmallScreen = false;
    }
    console.log(`current screen size: ${window.screen.width} so ${this.isSmallScreen}`);

    this.loginService.isAuthenticated.subscribe(
      data=> this.isAuthenticated=data
    );

  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  sanitizeGithubUrl() {
    return this.sanitize(`${this.gitHubUrl}`);
  }
  sanitizeTwitterUrl() {
    return this.sanitize(`${this.twitterUrl}`);
  }
  sanitizeLinkedInUrl(){
    return this.sanitize(`${this.linkedInUrl}`);
  }
  sanitizeInstagramUrl(){
    return this.sanitize(`${this.instagramUrl}`);
  }

  logout(){
    console.log("clicked logout");
    this.loginService.pushAuthToken(false);
  }
}
