import React from "react";
import { Game, INVALID_MOVE } from "boardgame.io/core";
import { Client } from "boardgame.io/react";

const isValidPieceMove = (currentSquare, nextSquare) => {
  if (currentSquare === nextSquare) {
    return false;
  }

  // TODO: one square at a time - up, down, right or left - NOT diagonal
  // Ex. currentSquare = e9 => possibleSquares = e8, d9, f9
  // Ex. currentSquare = e8 => possibleSquares = e7, d8, f8, e9

  return true;
};

const isVictory = (currentPlayer, piecePositions) => {
  if (
    (currentPlayer === "0" && piecePositions[currentPlayer].includes("1")) ||
    (currentPlayer === "1" && piecePositions[currentPlayer].includes("9"))
  ) {
    return true;
  }

  return false;
};

const Quoridor = Game({
  flow: {
    endGameIf: (G, ctx) => {
      if (isVictory(ctx.currentPlayer, G.piecePositions)) {
        return {
          winner: ctx.currentPlayer,
        };
      }
    },
    movesPerTurn: 1,
  },
  moves: {
    movePiece(G, ctx, square) {
      if (!isValidPieceMove(G.piecePositions[ctx.currentPlayer], square)) {
        return INVALID_MOVE;
      }

      G.piecePositions[ctx.currentPlayer] = square;
    },
  },
  name: "Quoridor",
  setup: () => ({
    // TODO: Design game state to accommodate piece appearance (eg. colour) and walls
    piecePositions: {
      "0": "e9",
      "1": "e1",
    },
  }),
});

const QuoridorBoard = React.memo(props => {
  return (
    <>
      <div style={{ width: "400px" }}>
        {["9", "8", "7", "6", "5", "4", "3", "2", "1"].map(row => (
          <QuoridorBoardRow
            G={props.G}
            key={row}
            moves={props.moves}
            rowID={row}
          />
        ))}
      </div>

      {props.ctx.gameover && <h2>Player {props.ctx.gameover.winner} wins!</h2>}
    </>
  );
});

const QuoridorBoardRow = props => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map(square => (
        <QuoridorBoardSquare
          G={props.G}
          key={`${square} ${props.rowID}`}
          moves={props.moves}
          squareID={`${square}${props.rowID}`}
        />
      ))}
    </div>
  );
};

const QuoridorBoardSquare = props => {
  return (
    <div
      onClick={() => props.moves.movePiece(props.squareID)}
      style={{ border: "1px solid", flex: "1", height: "40px", width: "40px" }}
    >
      {(props.G.piecePositions["0"] === props.squareID && <p>0</p>) ||
        (props.G.piecePositions["1"] === props.squareID && <p>1</p>)}
    </div>
  );
};

const App = Client({
  board: QuoridorBoard,
  debug: true,
  game: Quoridor,
});

export default App;
