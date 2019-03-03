import { movePiece } from "../App";
import { Game, INVALID_MOVE } from "boardgame.io/core";

let Quoridor;

beforeAll(() => {
  Quoridor = Game({
    moves: { movePiece },
    setup: () => ({
      piecePositions: {
        "0": "e9",
        "1": "e1",
      },
    }),
  });
});

test("Move piece to clicked square", () => {
  expect(
    Quoridor.processMove(
      {
        piecePositions: {
          "0": "e9",
          "1": "e1",
        },
      },
      {
        type: "movePiece",
        args: ["e8"],
      },
      { currentPlayer: "0" }
    )
  ).toEqual({
    piecePositions: {
      "0": "e8",
      "1": "e1",
    },
  });
});

test("Prevent invalid move of piece to clicked square", () => {
  expect(
    Quoridor.processMove(
      {
        piecePositions: {
          "0": "e9",
          "1": "e1",
        },
      },
      {
        type: "movePiece",
        args: ["e7"],
      },
      { currentPlayer: "0" }
    )
  ).toEqual(INVALID_MOVE);
});
