/* reversi.js */
var state = {
    board: [
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, '2', '1', null, null, null ],
        [ null, null, null, '1', '2', null, null, null ],
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null ],
    ],
    turn: '1',
    legalMoves: []
}

/**
 * @function updateLegalMoves
 * Sets the state's next legal moves
 */
function updateLegalMoves() {
  state.legalMoves = [];
  highlighted = document.querySelectorAll('.highlight');
  highlighted.forEach(elem => elem.classList.remove('highlight'));
  for (var y = 0; y < state.board.length; y++) {
    for (var x = 0; x < state.board[y].length; x++) {
        if (state.board[y][x] == null) { // we can't land on an existing piece
            var piecesToFlip = [];
            findMoves(x, y, '-', '', piecesToFlip); // west flips
            findMoves(x, y, '+', '', piecesToFlip); // east flips
            findMoves(x, y, '', '-', piecesToFlip); // north flips
            findMoves(x, y, '', '+', piecesToFlip); // south flips
            findMoves(x, y, '-', '-', piecesToFlip); // northwest flips
            findMoves(x, y, '-', '+', piecesToFlip); // southwest flips
            findMoves(x, y, '+', '-', piecesToFlip); // northeast flips
            findMoves(x, y, '+', '+', piecesToFlip); // southeast flips)

            if (piecesToFlip.length) {
                if (!state.legalMoves[y]) state.legalMoves[y] = [];
                state.legalMoves[y][x] = [];
                piecesToFlip.forEach(elt => state.legalMoves[y][x].push(elt))
                document.getElementById('square-' + x + '-' + y).classList.add('highlight');
            } 
        }
    }
  }
}

/**
 * @function findMoves
 * Finds moves from a starting point
 * In a given direction and returns them in
 * an out Array
 * @param {Number} x Starting X position
 * @param {Number} y Starting Y position
 * @param {String} horizontal '+', '-', or empty, for the
 *      desired horizontal direction
 * @param {String} vertical '+', '-', or empty, for the
 *      desired vertical direction
 * @param {Array} outArray The array reversed pieces will be returned to
 */
function findMoves(x, y, horizontal, vertical, outArray) {
    var newX = x;
    var newY = y;
    if (horizontal == '-') newX--;
    if (horizontal == '+') newX++;
    if (vertical == '-') newY--;
    if (vertical == '+') newY++;
    var tempFlips = [];

    while (newX >= 0 && newY >=0 && 
        newX < state.board.length && newY < state.board.length && 
        state.board[newY][newX] != null && state.board[newY][newX] != state.turn) {
            tempFlips.push({ x: newX, y: newY});
            if (horizontal == '-') newX--;
            if (horizontal == '+') newX++;
            if (vertical == '-') newY--;
            if (vertical == '+') newY++;
    }
    if (newX >= 0 && newY >=0 && 
        newX < state.board.length && newY < state.board.length &&
        state.board[newY][newX] == state.turn) {
            tempFlips.forEach(elt => outArray.push(elt));
        }
}

/**
 * @function nextTurn
 * Alternates the turn
 */
function nextTurn() {
    var turnDisplay = document.getElementById('turnDisplay');
    if (state.turn == '1') {
        state.turn = '2';
        turnDisplay.className = 'color-2';
        turnDisplay.innerText = "player 2's"
    } else {
        state.turn = '1'
        turnDisplay.className = 'color-1';
        turnDisplay.innerText = "player 1's"
    }
    updateLegalMoves();
    checkWinner();
}

/**
 * @function checkWinner
 * the game is over, declare a winner
 */
function checkWinner() {
    if (state.legalMoves.length == 0) {
        var playerOnePieces = document.querySelectorAll('.piece-1');
        var playerTwoPieces = document.querySelectorAll('.piece-2');
        var text = document.getElementById('playerMessage');
        if (playerOnePieces.length > playerTwoPieces.length) {
            text.innerHTML = "Player One Wins!";
            text.classList.add('color-1')
        } else if (playerTwoPieces.length > playerOnePieces.length) {
            text.innerHTML = "Player Two Wins!";
            text.classList.add('color-2')
        } else {
            text.innerHTML = "The game is a tie!";
        }
        message('Refresh the page to play again');
    }
}

/**
 * @function clickSquare
 * event handler for click of square
 */
function clickSquare(event) {
    event.preventDefault();
    message()
    var squareId = event.target.id
    var x = +squareId.charAt(7);
    var y = +squareId.charAt(9);
    if (!state.legalMoves[y] || !state.legalMoves[y][x] || state.legalMoves[y][x].length == 0) {
        message('That is not a legal move...');
        return;
    }
    // add new piece
    var newPiece = document.createElement('div');
    var square = document.getElementById('square-' + x + '-' + y)
    newPiece.classList.add('piece')
    newPiece.classList.add('piece-' + state.turn)
    newPiece.id = 'piece-' + x + '-' + y;
    square.appendChild(newPiece);
    state.board[y][x] = state.turn;
    // flip opposing pieces
    state.legalMoves[y][x].forEach(location => {
        var piece = document.getElementById('piece-' + location.x + '-' + location.y);
        piece.classList.remove('piece-' + state.board[location.y][location.x]);
        piece.classList.add('piece-' + state.turn);
        state.board[location.y][location.x] = state.turn;
    })
    nextTurn();
}

/**
 * @function message
 * Displays a message for 3 seconds below the board
 * @param {String} text - The text to be displayed, null to clear
 */
function message(text) {
    if (text) {
        document.getElementById('bottomMessage').innerText = text;
        setTimeout(function() {
            document.getElementById('bottomMessage').innerText = '';
        }, 3000);
    } else {
        document.getElementById('bottomMessage').innerText = '';
    }
}

/**
 * @function setup
 * Sets up the game environment
 */
function setup() {
  var board = document.createElement('section');
  board.id = 'game-board';
  document.body.appendChild(board);
  for (var y = 0; y < state.board.length; y++) {
    for (var x = 0; x < state.board[y].length; x++) {
      
      // create the squares
      var square = document.createElement('div');
      square.onclick = clickSquare;
      square.id = 'square-' + x + '-' + y;
      square.classList.add('square');
      if ((y+x) % 2) square.classList.add('black');
      
      // create the game pieces
      if(state.board[y][x]) {
        var piece = document.createElement('div');
        piece.classList.add('piece')
        piece.classList.add('piece-' + state.board[y][x])
        piece.id = 'piece-' + x + '-' + y;
        square.appendChild(piece);
      }

      board.appendChild(square);
    }
  }
  updateLegalMoves();
}

setup();