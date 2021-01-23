export class GameMoveRequest {

    movedBy: string;
    position: Number;
    gameCode: Number;

    constructor(movedBy: string,position: Number,gameCode: Number){
        this.movedBy = movedBy;
        this.position = position;
        this.gameCode = gameCode;
    }
}
