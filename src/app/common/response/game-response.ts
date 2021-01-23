import { GameData } from './game-data';

export class GameResponse {

    wonMessage: string;
    whoWonGame: string;
    gameData: GameData;
    gameCompleted: boolean;
    errorMessage: string;

}
