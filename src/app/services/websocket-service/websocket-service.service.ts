import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment'

declare var SockJS;
declare var Stomp;

@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {



  constructor() { }

  // Open connection with the back-end socket
  public connect() {
    let serverBaseUrl = environment.webSocketServerUrl;
    let socket = new SockJS(`${serverBaseUrl}/socket`);

    let stompClient = Stomp.over(socket);

    return stompClient;
  }
}
