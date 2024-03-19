// Создаем игровое поле
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

// Переменные для счета
let playerScore = 0;
let computerScore = 0;

// Переменная для отслеживания состояния игры (активна или завершена)
let gameActive = true;

// Функция для вывода игрового поля
function printBoard() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      document.getElementById(`cell-${i}-${j}`).innerText = board[i][j];
    }
  }
}

// Функция для проверки, является ли данная клетка пустой
function isEmpty(row, col) {
  return board[row][col] === '';
}

// Функция для проверки, есть ли победитель
function checkWinner() {
  // Проверяем горизонтали и вертикали
  for (let i = 0; i < 3; i++) {
    if (board[i][0] !== '' && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      return board[i][0]; // Возвращаем символ победителя (X или O)
    }
    if (board[0][i] !== '' && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
      return board[0][i]; // Возвращаем символ победителя (X или O)
    }
  }

  // Проверяем диагонали
  if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0]; // Возвращаем символ победителя (X или O)
  }
  if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2]; // Возвращаем символ победителя (X или O)
  }

  // Если никто не выиграл и еще есть пустые клетки, возвращаем null (продолжаем игру)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        return null;
      }
    }
  }
  // Если все клетки заполнены и нет победителя, то игра завершается в ничью
  return 'tie';
}

// Функция для обработки клика по клетке
function cellClicked(row, col) {
  if (!gameActive || !isEmpty(row, col)) return; // Если игра завершена или клетка не пустая, ничего не делаем
  board[row][col] = 'X';
  printBoard();
  let winner = checkWinner();
  if (winner !== null) {
    endGame(winner);
  } else {
    computerMove();
    printBoard();
    winner = checkWinner();
    if (winner !== null) {
      endGame(winner);
    }
  }
}

// Функция для хода компьютера
function computerMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (isEmpty(i, j)) {
        board[i][j] = 'O';
        let score = minimax(board, 0, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { row: i, col: j };
        }
      }
    }
  }
  board[move.row][move.col] = 'O';
}

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) {
    if (result === 'O') {
      return 1;
    } else if (result === 'X') {
      return -1;
    } else {
      return 0;
    }
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (isEmpty(i, j)) {
          board[i][j] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (isEmpty(i, j)) {
          board[i][j] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

// Функция для окончания игры
function endGame(winner) {
  gameActive = false; // Устанавливаем состояние игры в "завершено"
  let message;
  if (winner === 'tie') {
    message = 'Ничья!';
    playerScore++;
    computerScore++;
  } else if (winner === 'X') {
    message = 'Победил игрок!';
    playerScore++;
  } else {
    message = 'Победил компьютер!';
    computerScore++;
  }
  document.getElementById('title').innerText = message;
  document.getElementById('playerScore').innerText = playerScore;
  document.getElementById('computerScore').innerText = computerScore;
  document.getElementById('restartButton').style.display = 'block'; // Отображаем кнопку "заново"
}

// Функция для перезапуска игры
function restartGame() {
  gameActive = true; // Устанавливаем состояние игры в "активно"
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]; // Очищаем игровое поле
  printBoard(); // Выводим очищенное игровое поле
  document.getElementById('title').innerText = 'Игра "Крестики-нолики"'; // Возвращаем начальное название игры
  document.getElementById('restartButton').style.display = 'none'; // Скрываем кнопку "заново"
}

// Скрываем кнопку "заново" при загрузке страницы
window.onload = function() {
  document.getElementById('restartButton').style.display = 'none';
}
