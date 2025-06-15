// script.js
class TicTacToe {
    constructor() {
        this.board = document.getElementById('board');
        this.cells = document.querySelectorAll('[data-cell]');
        this.winningMessage = document.getElementById('winningMessage');
        this.winningMessageText = document.getElementById('winningMessageText');
        this.restartButton = document.getElementById('restartButton');
        this.twoPlayerMode = document.getElementById('twoPlayerMode');
        this.computerMode = document.getElementById('computerMode');
        this.xScore = document.getElementById('xScore');
        this.oScore = document.getElementById('oScore');
        
        this.currentPlayer = 'x';
        this.isComputerMode = false;
        this.scores = { x: 0, o: 0 };
        
        this.WINNING_COMBINATIONS = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.initializeGame();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', this.handleClick.bind(this), { once: true });
        });

        this.restartButton.addEventListener('click', this.startGame.bind(this));
        this.twoPlayerMode.addEventListener('click', () => this.setGameMode(false));
        this.computerMode.addEventListener('click', () => this.setGameMode(true));

        this.startGame();
    }

    startGame() {
        this.cells.forEach(cell => {
            cell.classList.remove('x', 'o');
            cell.removeEventListener('click', this.handleClick);
            cell.addEventListener('click', this.handleClick.bind(this), { once: true });
        });
        
        this.currentPlayer = 'x';
        this.winningMessage.classList.remove('show');
        this.updatePlayerDisplay();
    }

    setGameMode(isComputer) {
        this.isComputerMode = isComputer;
        this.twoPlayerMode.classList.toggle('active', !isComputer);
        this.computerMode.classList.toggle('active', isComputer);
        this.startGame();
    }

    handleClick(e) {
        const cell = e.target;
        this.placeMark(cell, this.currentPlayer);

        if (this.checkWin(this.currentPlayer)) {
            this.endGame(false);
        } else if (this.isDraw()) {
            this.endGame(true);
        } else {
            this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
            this.updatePlayerDisplay();

            if (this.isComputerMode && this.currentPlayer === 'o') {
                this.makeComputerMove();
            }
        }
    }

    makeComputerMove() {
        const emptyCells = [...this.cells].filter(cell => 
            !cell.classList.contains('x') && !cell.classList.contains('o')
        );
        
        if (emptyCells.length > 0) {
            setTimeout(() => {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                this.placeMark(randomCell, 'o');
                
                if (this.checkWin('o')) {
                    this.endGame(false);
                } else if (this.isDraw()) {
                    this.endGame(true);
                } else {
                    this.currentPlayer = 'x';
                    this.updatePlayerDisplay();
                }
            }, 500);
        }
    }

    placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
    }

    checkWin(currentClass) {
        return this.WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return this.cells[index].classList.contains(currentClass);
            });
        });
    }

    isDraw() {
        return [...this.cells].every(cell => {
            return cell.classList.contains('x') || cell.classList.contains('o');
        });
    }

    endGame(draw) {
        if (draw) {
            this.winningMessageText.innerText = 'Draw!';
        } else {
            this.winningMessageText.innerText = `${this.currentPlayer.toUpperCase()} Wins!`;
            this.scores[this.currentPlayer]++;
            this.updateScoreBoard();
        }
        this.winningMessage.classList.add('show');
    }

    updateScoreBoard() {
        this.xScore.textContent = this.scores.x;
        this.oScore.textContent = this.scores.o;
    }

    updatePlayerDisplay() {
        document.querySelector('.player-x').classList.toggle('active', this.currentPlayer === 'x');
        document.querySelector('.player-o').classList.toggle('active', this.currentPlayer === 'o');
    }
}

// Initialize the game
new TicTacToe();