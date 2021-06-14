import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { GameResponse } from 'src/app/common/response/game-response';
import { map } from 'rxjs/operators';
import { GameMoveRequest } from '../../common/response/game-move-request'

@Injectable({
  providedIn: 'root'
})
export class GameBackendService {

  private baseUrl = environment.serverUrl;

  private historyUrl = environment.historyUrl;

  constructor(private httpClient: HttpClient) { }

  checkForGameCodeAvailability(gameCode: Number) : Observable<HttpResponse<GameResponse>> {
    return this.httpClient.get<GameResponse>(`${this.baseUrl}/game/data/${gameCode}`,{observe:'response'}).pipe(
      map(response => response)
    );
  }

  createNewGame() : Observable<HttpResponse<Number>> {
    return this.httpClient.get<Number>(`${this.baseUrl}/game/create/new`,{observe: 'response'}).pipe(
      map(response => response)
    );
  }

  continueMove(gameMoveRequest: GameMoveRequest) : Observable<HttpResponse<any>>{
    return this.httpClient.post<any>(`${this.baseUrl}/game/continue/move`,gameMoveRequest,{observe: 'response'}).pipe(
      map(response => response)
    );
  }

  startGame(gameCode: Number): Observable<HttpResponse<any>>{
    return this.httpClient.put<any>(`${this.baseUrl}/game/start/${gameCode}`,new Object(),{observe: 'response'}).pipe(
      map(response => response)
    );
  }

  getHistory(header: HttpHeaders): Observable<HttpResponse<any>>{
    return this.httpClient.post<any>(`${this.historyUrl}/history/get`, new Object() ,{observe:'response', headers: header}).pipe(
      map(response => response)
    );
  }

}
