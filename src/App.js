import { Game } from 'boardgame.io/core';
import { Client } from 'boardgame.io/react';

const Quoridor = Game({
  moves: {
    clickCell(G, ctx, id) {
      G.cells[id] = ctx.currentPlayer;
    },
  },
  setup: () => ({
    cells: Array(9).fill(null),
  }),
});

const App = Client({
  debug: true,
  game: Quoridor,
});

export default App;
