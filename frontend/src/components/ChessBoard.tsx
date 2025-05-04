import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ chess, board, setBoard, socket }: {
    chess: Chess;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
}) => {
    const [from, setFrom] = useState<Square | null>(null);
    const [to, setTo] = useState<Square | null>(null);
    // const [chess, setChess] = useState(new Chess());
    // const [board, setBoard] = useState(chess.board());

    return <div className="text-white-200">
        {board.map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {
                            
                    const squareNotation = String.fromCharCode(97+(j%8)) + "" 
                    + (8-i) as Square;
                    
                    return <div onClick={() => {
                        if(!from) {
                            setFrom(squareNotation);
                        } else {
                            // console.log(from, to);
                            
                            socket.send(JSON.stringify({
                                type: MOVE,
                                payload: {
                                    from,
                                    to: squareNotation
                                }
                            }))
                            setFrom(null);
                            chess.move({
                                from,
                                to: squareNotation
                            });
                            setBoard(chess.board());
                            console.log({from, to: squareNotation});
                            
                        }
                    }} key={j} className={`w-12 h-12 ${(i + j) % 2 === 0 ? 'bg-green-500' :
                        'bg-white'}`}>
                        <div className="w-full h-full justify-center flex">
                            <div className="h-full justify-center flex flex-col ">
                                {square ? <img className="w-full h-full" src={`/${square.color === "b" ? 
                                    `${square?.type}-b` : `${square?.type?.toLowerCase()}-w`}.svg`} /> 
                                : null }
                            </div>
                        </div>
                    </div>
                })}
            </div>
        })}
    </div>
}