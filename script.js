document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('[data-cell]');
    const statusDiv = document.getElementById('status');
    const nextGameBtn = document.getElementById('next-game-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const winnerModal = document.getElementById('winner-modal');
    const winnerMessage = document.getElementById('winner-message');
    const tiebreakerModal = document.getElementById('tiebreaker-modal');
    const tiebreakerMessage = document.getElementById('tiebreaker-message');
    const gameInfo = document.getElementById('game-info');
    const pointsDisplay = document.getElementById('points');
    const leaderDisplay = document.getElementById('leader');

    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let gameCount = 1;
    let points = { X: 0, O: 0 };
    const totalGames = 5;

    cells.forEach(cell => cell.addEventListener('click', handleClick));

    nextGameBtn.addEventListener('click', handleNextGame);
    restartGameBtn.addEventListener('click', restartSeries);

    function handleClick(event) {
        const cellIndex = Array.from(cells).indexOf(event.target);

        if (board[cellIndex] || !gameActive) return;

        board[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWin()) {
            points[currentPlayer]++;
            updateScore();
            gameActive = false;
            if (gameCount === totalGames) {
                handleTiebreaker();
            } else {
                showWinnerModal(`${currentPlayer} wins this game!`);
            }
        } else if (board.every(cell => cell)) {
            gameActive = false;
            if (gameCount === totalGames) {
                handleTiebreaker();
            } else {
                showWinnerModal(`It's a draw!`);
            }
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDiv.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function checkWin() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]            // Diagonals
        ];
        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }

    function updateScore() {
        pointsDisplay.textContent = `Player X: ${points.X} | Player O: ${points.O}`;
        updateLeader();
    }

    function updateLeader() {
        if (points.X > points.O) {
            leaderDisplay.textContent = 'Leader: Player X';
        } else if (points.O > points.X) {
            leaderDisplay.textContent = 'Leader: Player O';
        } else {
            leaderDisplay.textContent = 'Leader: None';
        }
    }

    function showWinnerModal(message) {
        winnerMessage.textContent = message;
        // Determine button text based on series state
        if (gameCount === totalGames && points.X !== points.O) {
            nextGameBtn.textContent = 'New Game';  // Series ended, show 'New Game'
        } else {
            nextGameBtn.textContent = 'Next Game';
        }
        winnerModal.classList.remove('hidden');
    }

    function handleTiebreaker() {
        if (points.X === points.O) {
            tiebreakerMessage.textContent = 'The game is tied after 5 rounds! Starting tiebreaker...';
            tiebreakerModal.classList.remove('hidden');
        } else {
            showWinnerModal(`${points.X > points.O ? 'Player X' : 'Player O'} wins the series!`);
        }
    }

    function handleNextGame() {
        winnerModal.classList.add('hidden');
        if (nextGameBtn.textContent === 'New Game') {
            restartSeries();  // Reset for new series if "New Game" is clicked
        } else {
            gameCount++;
            gameInfo.textContent = `Game ${gameCount} of ${totalGames}`;
            resetBoard();
            gameActive = true;
            currentPlayer = gameCount % 2 === 0 ? 'O' : 'X'; // Alternate first player
            statusDiv.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function resetBoard() {
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => cell.textContent = '');
    }

    function restartSeries() {
        points = { X: 0, O: 0 };
        gameCount = 1;
        updateScore();
        updateLeader();
        gameInfo.textContent = `Game 1 of ${totalGames}`;
        resetBoard();
        gameActive = true;
        currentPlayer = 'X';
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
        winnerModal.classList.add('hidden');
        tiebreakerModal.classList.add('hidden');
    }
});
