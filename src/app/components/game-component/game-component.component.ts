import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute, RouteConfigLoadEnd, Router } from '@angular/router';
import { GameResponse } from 'src/app/common/response/game-response';
import { SessionStorageService } from 'src/app/services/storage-service/session-storage.service';
import { WebsocketServiceService } from 'src/app/services/websocket-service/websocket-service.service';
import { GameBackendService } from 'src/app/services/game-backend/game-backend.service';
import { GameMoveRequest } from 'src/app/common/response/game-move-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


const Xplayer: string = 'assets/images/ic_X.svg';
const Oplayer: string = 'assets/images/ic_O.svg';
const blankPlayer: string = 'assets/images/ic_blank.svg';

export interface DialogData {
  gameMessage: string;
  winnerIcon: string;
}

@Component({
  selector: 'app-game-component',
  templateUrl: './game-component.component.html',
  styleUrls: ['./game-component.component.css']
})
export class GameComponentComponent implements OnInit {


  gameResponse: GameResponse;

  gameCode: string;

  gamePlayer: string;

  currentPlayer: string;

  gamePlayerIcon: string;
  currentPlayerIcon: string;

  constructor(private webSocketService: WebsocketServiceService,
    private route: ActivatedRoute,
    private storageService: SessionStorageService,
    private gameBackendService: GameBackendService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
      this.gameCode = this.storageService.getDataFromStorage("gameCode");
      if (this.gameCode === null || (this.gameCode != null && this.gameCode.trim().length === 0)) {
        this.navigateToHome();
      }
      this.gameBackendService.checkForGameCodeAvailability(Number(this.gameCode)).subscribe(
        response => {
          if (response.status === 200) {
            this.gameResponse = response.body;
            this.gamePlayer = this.storageService.getDataFromStorage("gamePlayer");
            this.subscribeToGameCode(this.gameCode);
            this.decideCurrentPlayer();
          } else {
            this.navigateToHome();
          }
        });
    });

  }

  navigateToHome() {
    this.storageService.clearStore();
    this.router.navigateByUrl("/home");
  }

  subscribeToGameCode(gameCode: string) {
    // Open connection with server socket
    let stompClient = this.webSocketService.connect();
    stompClient.connect({}, frame => {
      this.setPlayerIcon();
      // Subscribe to notification topic
      stompClient.subscribe(`/topic/${gameCode}`, notifications => {
        let temp = JSON.parse(notifications.body)
        console.log(`subsciption response ${temp}`);
        this.gameResponse = temp;
        this.decideCurrentPlayer();
        if (this.gameResponse.gameCompleted) {
          console.log("Game completed::");
          if(this.gamePlayerIcon === this.gameResponse.whoWonGame){
            this.openSuccessDailogue("Congratulations you won the game", this.gameResponse.whoWonGame);
          }else{
            this.openSuccessDailogue("Better luck next time you lost the game", this.gameResponse.whoWonGame);
          }
          this.storageService.clearStore();
        }
      })
    });
  }

  setPlayerIcon(){
    if(this.gamePlayer === 'O'){
      this.gamePlayerIcon = Oplayer
    }else if(this.gamePlayer === 'X'){
      this.gamePlayerIcon = Xplayer;
    }
  }

  decideCurrentPlayer() {
    if (this.gameResponse.gameData.lastMoveBy === 'O') {
      this.currentPlayer = 'X';
      this.currentPlayerIcon = Xplayer;
    } else if (this.gameResponse.gameData.lastMoveBy === 'X') {
      this.currentPlayer = 'O';
      this.currentPlayerIcon = Oplayer;
    }
  }

  processClick(position: string) {
    console.log(`clicked ${position} and current player: ${this.currentPlayer} game player: ${this.gamePlayer}`);
    if (this.gameResponse.gameData.spacesOccupiedPlayerIcons[position] === blankPlayer) {
      if (this.currentPlayer === this.gamePlayer) {
        let request: GameMoveRequest = new GameMoveRequest(this.gamePlayer, Number(position), Number(this.gameCode));
        this.gameBackendService.continueMove(request).subscribe(response => {
          if (response.status === 200) {
            console.log("moved completed");
          } else {
            // TODO for failure
          }
        });
      } else {
        this.showSnakeBar("Not your turn", "Okay");
      }
    } else {
      this.showSnakeBar("The space is already occupied", "Okay");
    }
  }

  showSnakeBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  openSuccessDailogue(message: string, winnerIcon: string){
    const dialogRef = this.dialog.open(SuccessDailogue, {
      width: '250px',
      data: {gameMessage: message, winnerIcon: winnerIcon}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Winner dailogue closed');
      this.navigateToHome();
    });
  }
}

@Component({
  selector: 'success-dailogue-component',
  templateUrl: 'success-dailogue-component.html',
})
export class SuccessDailogue {

  constructor(
    public dialogRef: MatDialogRef<SuccessDailogue>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
