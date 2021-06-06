import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from './../../services/storage-service/session-storage.service';
import { WebsocketServiceService } from '../../services/websocket-service/websocket-service.service';
import { GameBackendService } from '../../services/game-backend/game-backend.service'
import { GameResponse } from '../../common/response/game-response'
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { Clipboard } from '@angular/cdk/clipboard';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgModel } from '@angular/forms';
import { faShare } from '@fortawesome/free-solid-svg-icons/faShare';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp'
import { Platform } from '@angular/cdk/platform';
import { DomSanitizer } from '@angular/platform-browser';

const navigator = window.navigator as any;

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent implements OnInit {

  loginMessage: string="";
  gameCode: Number = 0;
  gameResponse: GameResponse;
  gameCodeEnteredModel: string;
  faCopy = faCopy;
  faShare = faShare;
  faWhatsapp = faWhatsapp;
  isMobile: boolean;
  whatsAppUrl: any;
  clientUrl: string = environment.clientUrl;
  constructor(private storageService: SessionStorageService,
    private webSocketService: WebsocketServiceService,
    private gameBackendService: GameBackendService,
    private router: Router,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private platform: Platform,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.addLoginMessage();
    this.setIsMobile();
    if (this.storageService.checkKeyExistedOrNot("gameCode") && this.storageService.getDataFromStorage("gameCode") != undefined) {
      this.gameBackendService.checkForGameCodeAvailability(Number(this.storageService.getDataFromStorage("gameCode"))).subscribe(
        response => {
          console.log(`response: ${response} and statuscode ${response.status}`);
          if (response.status === 200) {
            this.gameCode = Number(this.storageService.getDataFromStorage("gameCode"));
            this.gameResponse = response.body;
            console.log(`response after parsing : ${this.gameResponse}`);
            if (this.gameResponse.gameData.gameStarted) {
              this.startGame(this.storageService.getDataFromStorage("gamePlayer"), String(this.gameCode));
            } else {
              this.connectToWebSocket(this.gameCode);
              this.whatsAppUrl = this.sanitize(`whatsapp://send?text=Enter gameCode ${this.gameCode} @ ${this.clientUrl}`);
            }
          } else {
            this.createNewGame();
          }
        }
      );
    } else {
      this.createNewGame();
    }
  }

  addLoginMessage(){
    this.loginMessage="";
    if(this.storageService.checkKeyExistedOrNot("user")){
      this.loginMessage=`Welcome ${this.storageService.getDataFromStorage("user")}`;
    }
  }

  setIsMobile() {
    if (this.platform.ANDROID || this.platform.IOS || this.isMobile) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  sanitizeWhatsApp() {
    if (this.isMobile) {
      return this.sanitize(`whatsapp://send?text=Enter gameCode ${this.gameCode} @ ${this.clientUrl}`);
    } else {
      return this.sanitize(`https://wa.me/?text='Enter gameCode ${this.gameCode} @ ${this.clientUrl}'`);
    }
  }

  startGame(playerName: string, gameCode: string) {
    this.storageService.addDataToStorage("gameCode", gameCode);
    this.storageService.addDataToStorage("gamePlayer", playerName);
    this.router.navigateByUrl("/game");
  }

  async shareByMobile() {
    if (navigator.share) {
      navigator
        .share({
          title: 'Lets play Tik Tok Toe',
          text: `use ${this.gameCode} game code in below url`,
          url: environment.clientUrl
        })
        .then(() => console.log('Successful share'))
        .catch(error => {
          console.log('Error sharing', error);
          alert('Sorry share not supported in your browser');
      });
    } else {
      alert('Sorry share not supported in your browser');
    }
  }

  enterGameCode() {
    if (isNaN(+this.gameCodeEnteredModel)) {
      this.showSnakeBar("Invalid Game Code please enter a valid gameCode", "Okay");
    } else {
      if (this.gameCodeEnteredModel.trim() === String(this.gameCode)) {
        this.showSnakeBar("gamecode should not be your game code","okay");
      } else {
        this.gameBackendService.startGame(Number(this.gameCodeEnteredModel)).subscribe(
          response => {
            console.log(`response :: ${response} `);
            if (response.status === 200) {
              this.startGame("X", this.gameCodeEnteredModel.trim());
            } else if (response.status === 204) {
              this.showSnakeBar("This game is not available", "Okay");
            } else if (response.status === 208) {
              this.showSnakeBar("This game is already started you cannot join already started game", "Okay");
            }
          }
        );
      }
    }
  }

  createNewGame() {
    this.gameBackendService.createNewGame().subscribe(
      response => {
        this.gameCode = response.body;
        this.storageService.addDataToStorage("gameCode", String(this.gameCode));
        this.connectToWebSocket(this.gameCode);
        this.whatsAppUrl = this.sanitize(`whatsapp://send?text=Enter gameCode ${this.gameCode} @ ${this.clientUrl}`);
      }
    );
  }

  connectToWebSocket(gameCode: Number) {
    let stompClient = this.webSocketService.connect();
    stompClient.connect({}, frame => {
      stompClient.subscribe(`/topic/${gameCode}`, notifications => {
        this.gameResponse = JSON.parse(notifications.body);
        console.log(`response after parsing : ${this.gameResponse}`);
        if (this.gameResponse.gameData.gameStarted) {
          this.startGame("O", String(this.gameCode));
        }
      })
    });
  }

  copyToClipBoard() {
    this.clipboard.copy(`${this.gameCode}`);
    this.showSnakeBar("Copied to clipboard", "Okay");
  }
  showSnakeBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
