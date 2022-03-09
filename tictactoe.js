const menu = document.getElementById("menu");
const xName = document.getElementById("xName");
const oName = document.getElementById("oName");
const xhumanorbot = document.getElementById("xhumanorbot");
const ohumanorbot = document.getElementById("ohumanorbot");
const start = document.getElementById("start");

const description = document.getElementById("description");
description.setAttribute("style", "white-space: pre;");
const drawScore = document.getElementById("drawScore");
const xScore = document.getElementById("xScore");
const oScore = document.getElementById("oScore");
const xDisplay = document.getElementById("xDisplay");
const oDisplay = document.getElementById("oDisplay");
const resetBtn = document.getElementById("reset");
const newgame = document.getElementById("newgame");

const container = document.getElementById("container");
const card = document.getElementsByClassName("card");


const Gameboard = (() => {
  const board = Array(9).fill("");

  const display = () => {
    for (let i = 0; i < card.length; i++) {
      card[i].textContent = board[i];
    }
    return board;
  };

  const fill = (index, symbol) => {
    board[index] = symbol;
  };

  return {
    display,
    fill,
  };
})();

const Player = (symbol, name) => {
  const mark = (index) => {
    Game.play(index, symbol);
  };

  const getName = () => {
    return name;
  };

  return {
    mark,
    getName,
  };
};


const Game = (() => {
  let _turn = 0;
  let _score = {
    X: 0,
    O: 0,
    draw: 0,
  };
  let _isRunning = true;

  const play = (index, symbol) => {
    if (!_checkValidity(index) || !_isRunning) return;
    _turn++;
    description.textContent =
      player[symbol].getName() +
      " marked " +
      index +
      "!\r\n" +
      player[_opposite(symbol)].getName() +
      "'s turn";
    Gameboard.fill(index, symbol);
    Gameboard.display();
    if (_turn >= 5) _checkStatus(symbol);
    if (_turn === 9 && _isRunning) _announceDraw();
  };

  const _checkValidity = (index) => {
    return Gameboard.display()[index] === "";
  };

  const _checkStatus = (symbol) => {
    console.log("checking status...");
    const board = Gameboard.display();
    let boardIndex = 0;

    const newBoard = new Array(3);
    for (let i = 0; i < 3; i++) {
      newBoard[i] = [];
      for (let j = 0; j < 3; j++) {
        newBoard[i][j] = board[boardIndex++];
      }
    }

    let key = new Array(3);

    for (let i = 0; i < 3; i++) {
      // check for same i
      for (let j = 0; j < 3; j++) {
        key[j] = newBoard[i][j];
      }
      checkKey();

      // check for same j
      for (let j = 0; j < 3; j++) {
        key[j] = newBoard[j][i];
      }
      checkKey();
    }

    // check for diagonal
    key[0] = board[0];
    key[1] = board[4];
    key[2] = board[8];
    checkKey();

    key[0] = board[2];
    key[2] = board[6];
    checkKey();

    function checkKey() {
      if (key[0] === key[1] && key[0] === key[2] && key[0] !== "") {
        _announceWinner(symbol);
      }
    }
  };

  const _opposite = (symbol) => {
    return symbol === "X" ? "O" : "X";
  };

  const _announceWinner = (winner) => {
    _isRunning = false;
    description.textContent = player[winner].getName() + " win!";
    description.textContent += "\r\nplay again?";
    resetBtn.textContent = "new round";
    _score[winner]++;
    _updateScore();
  };

  const _announceDraw = () => {
    _isRunning = false;
    description.textContent = "It's a draw!\r\nplay again?";
    resetBtn.textContent = "new round";
    _score.draw++;
    _updateScore();
  };

  const _updateScore = () => {
    xScore.textContent = _score.X;
    oScore.textContent = _score.O;
    drawScore.textContent = _score.draw;
  };

  const playTurn = (index) => {
    if (_turn % 2 === 0) {
      player.X.mark(index);
    } else {
      player.O.mark(index);
    }
  };

  const _botTurn = () => {
    const availableIndex = [];
    for (let i = 0; i < 9; i++) {
      if (Gameboard.display()[i] === "") {
        availableIndex.push(i);
      }
    }
    const randomIndex =
      availableIndex[Math.floor(Math.random() * availableIndex.length)];
    playTurn(randomIndex);
    console.log(
      "hi, the availableIndex is " +
        availableIndex +
        ", and the randomIndex is " +
        randomIndex
    );
  };

  const botMove = () => {
    _botTurn();
  };

  const reset = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.fill(i, "");
    }
    Gameboard.display();
    _turn = 0;
    _isRunning = true;
    description.textContent = "Round resetted!\r\n";
    description.textContent += "click the cards below to start the game";
    resetBtn.textContent = "reset round";
  };

  const initialize = () => {
    reset();
    description.textContent =
      "Welcome to Tic Tac Toe!\r\nStart clicking the cards below to play";
    xDisplay.textContent = xName.value;
    oDisplay.textContent = oName.value;
    for (const key in _score) {
      _score[key] = 0;
    }
    _updateScore();
  };

  return {
    play,
    playTurn,
    botMove,
    reset,
    initialize,
  };
})();


const player = {
  X: Player("X", "Jeff"),
  O: Player("O", "Google"),
};

for (let i = 0; i < card.length; i++) {
  card[i].addEventListener("click", () => {
    Game.playTurn(i);
  });
}

start.addEventListener("click", () => {
  menu.style.display = "none";
  player.X = Player("X", xName.value);
  player.O = Player("O", oName.value);
  Game.initialize();
});

resetBtn.addEventListener("click", () => {
  Game.reset();
});

newgame.addEventListener("click", () => {
  menu.style.display = "flex";
});
