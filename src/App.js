import React from "react";
import { Game, INVALID_MOVE } from "boardgame.io/core";
import { Client } from "boardgame.io/react";

const isValidPieceMove = (currentPlayer, nextSquare, piecePositions) => {
  const currentSquare = piecePositions[currentPlayer];

  if (typeof currentSquare === "undefined") {
    return false;
  }

  if (typeof nextSquare === "undefined") {
    return false;
  }

  if (
    nextSquare === piecePositions["0"] ||
    nextSquare === piecePositions["1"]
  ) {
    return false;
  }

  const opponent = currentPlayer === "0" ? "1" : "0";

  const opponentSquare = piecePositions[opponent];

  const validMoves = [
    movePieceUp(currentSquare, opponentSquare),
    movePieceRight(currentSquare, opponentSquare),
    movePieceDown(currentSquare, opponentSquare),
    movePieceLeft(currentSquare, opponentSquare),
  ];

  if (!validMoves.includes(nextSquare)) {
    return false;
  }

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

const movePieceDown = (currentSquare, opponentSquare) => {
  const rows = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];

  const [currentColumn, currentRow] = currentSquare.split("");

  const rowBelowCurrentSquare = rows[rows.indexOf(currentRow) + 1];

  if (typeof rowBelowCurrentSquare === "undefined") {
    return null;
  }

  let move = `${currentColumn}${rowBelowCurrentSquare}`;

  // If opponent's piece occupies square of a normal valid move
  // current player's piece may "jump" it
  if (opponentSquare === move) {
    const [, opponentRow] = opponentSquare.split("");

    const rowBelowOpponentSquare = rows[rows.indexOf(opponentRow) + 1];

    move = `${currentColumn}${rowBelowOpponentSquare}`;
  }

  return move;
};

const movePieceLeft = (currentSquare, opponentSquare) => {
  const columns = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

  const [currentColumn, currentRow] = currentSquare.split("");

  const columnLeftOfCurrentSquare = columns[columns.indexOf(currentColumn) - 1];

  if (typeof columnLeftOfCurrentSquare === "undefined") {
    return null;
  }

  let move = `${columnLeftOfCurrentSquare}${currentRow}`;

  // If opponent's piece occupies square of a normal valid move
  // current player's piece may "jump" it
  if (opponentSquare === move) {
    const [opponentColumn] = opponentSquare.split("");

    const columnLeftOfOpponentSquare =
      columns[columns.indexOf(opponentColumn) - 1];

    move = `${columnLeftOfOpponentSquare}${currentRow}`;
  }

  return move;
};

const movePieceRight = (currentSquare, opponentSquare) => {
  const columns = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

  const [currentColumn, currentRow] = currentSquare.split("");

  const columnRightOfCurrentSquare =
    columns[columns.indexOf(currentColumn) + 1];

  if (typeof columnRightOfCurrentSquare === "undefined") {
    return null;
  }

  let move = `${columnRightOfCurrentSquare}${currentRow}`;

  // If opponent's piece occupies square of a normal valid move
  // current player's piece may "jump" it
  if (opponentSquare === move) {
    const [opponentColumn] = opponentSquare.split("");

    const columnRightOfOpponentSquare =
      columns[columns.indexOf(opponentColumn) + 1];

    move = `${columnRightOfOpponentSquare}${currentRow}`;
  }

  return move;
};

const movePieceUp = (currentSquare, opponentSquare) => {
  const rows = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];

  const [currentColumn, currentRow] = currentSquare.split("");

  const rowAboveCurrentSquare = rows[rows.indexOf(currentRow) - 1];

  if (typeof rowAboveCurrentSquare === "undefined") {
    return null;
  }

  let move = `${currentColumn}${rowAboveCurrentSquare}`;

  // If opponent's piece occupies square of a normal valid move
  // current player's piece may "jump" it
  if (opponentSquare === move) {
    const [, opponentRow] = opponentSquare.split("");

    const rowAboveOpponentSquare = rows[rows.indexOf(opponentRow) - 1];

    move = `${currentColumn}${rowAboveOpponentSquare}`;
  }

  return move;
};

/**
 * movePiece
 * @param {Object} G
 * @param {Object} ctx
 * @param {String} square
 */
export function movePiece(G, ctx, square) {
  if (!isValidPieceMove(ctx.currentPlayer, square, G.piecePositions)) {
    return INVALID_MOVE;
  }

  G.piecePositions[ctx.currentPlayer] = square;
}

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
  moves: { movePiece },
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
