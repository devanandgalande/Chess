import { Chess, WHITE } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;
    private moveCount: number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.moveCount = 0;
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
        console.log('started match');
        
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {
        console.log(this.board.history());
        
        //validate the type of move - if its the users turn to move
        if(this.board.history().length % 2 === 0 && socket !== this.player1) {
            return;
        }
        if(this.board.history().length % 2 === 1 && socket !== this.player2) {
            return;
        }

        try {
            this.board.move(move);
        } catch(e) {
            console.log(e);
            return;
        }

        //check if the game is over
        if(this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === WHITE ? "black" : "white"
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === WHITE ? "black" : "white"
                }
            }))
            return;
        }

        //send the updated board to both players 
        if(this.board.history().length % 2 === 0) {
            this.player1.send(JSON.stringify({
                type: MOVE, 
                payload: move
            }))
        } else {
            this.player2.send(JSON.stringify({
                type: MOVE, 
                payload: move
            }))
        }

        this.moveCount++;
    }
}