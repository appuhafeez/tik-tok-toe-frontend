import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GameBackendService } from 'src/app/services/game-backend/game-backend.service';
import { LoginServiceService } from 'src/app/services/login-service/login-service.service';
import { SessionStorageService } from 'src/app/services/storage-service/session-storage.service';
import { HistoryResponse } from '../../common/response/history-response';

@Component({
  selector: 'app-history-screen',
  templateUrl: './history-screen.component.html',
  styleUrls: ['./history-screen.component.css']
})
export class HistoryScreenComponent implements OnInit {

  historyData: HistoryResponse[] = [];

  constructor(private backendService: GameBackendService,
    private loginService: LoginServiceService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(){
    this.loginService.regenerateTokenIfExpired();
    let headers = new HttpHeaders({
      'Authorization': this.sessionService.getDataFromStorage("accessToken") });
    this.backendService.getHistory(headers).subscribe(response => {
      if(response.status === 200){
        this.historyData = response.body;
      }else{
        console.log(`call failed with status: ${response.status}`);
      }
    })
  }

}
