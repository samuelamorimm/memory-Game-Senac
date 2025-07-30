document.addEventListener('DOMContentLoaded', () => {
    // Configurações do jogo
    const cardData = [
        { image: 'assets/imgs/zoro.jpeg', questions: [
            "Qual é o sonho de Zoro?",
            "Qual o estilo de luta de Zoro?",
            "Quantas espadas Zoro normalmente usa?"
        ], answers: [
            ["Tornar-se o melhor espadachim", "Ser o Rei dos Piratas", "Encontrar o One Piece", "Derrotar o Akainu"], 
            ["Santoryu", "Nitoryu", "Itto-ryu", "Haki puro"],
            ["1", "2", "3", "4"]
        ], correct: [0, 0, 2] },
        { image: 'assets/imgs/luffy.jpeg', questions: [
            "Qual é a fruta do diabo de Luffy?",
            "Qual o nome do chapéu de Luffy?",
            "Quem deu o chapéu para Luffy?"
        ], answers: [
            ["Gomu Gomu no Mi", "Mera Mera no Mi", "Hito Hito no Mi", "Gura Gura no Mi"],
            ["Chapéu de Palha", "Chapéu de Pirata", "Chapéu do Rei", "Chapéu da Liberdade"],
            ["Shanks", "Garp", "Roger", "Rayleigh"]
        ], correct: [0, 0, 0] },
        // Adicione dados similares para os outros personagens...
    ];

    // Elementos do DOM
    const startScreen = document.getElementById('start-screen');
    const winScreen = document.getElementById('win-screen');
    const gameContainer = document.getElementById('game-container');
    const memoryBoard = document.getElementById('memory-board');
    const startButton = document.getElementById('start-button');
    const homeButton = document.getElementById('home-button');
    const saveButton = document.getElementById('save-button');
    const restartButton = document.getElementById('restart-button');
    const pairsDisplay = document.getElementById('pairs-display');
    const timerDisplay = document.getElementById('timer-display');
    const movesDisplay = document.getElementById('moves-display');
    const finalTimeDisplay = document.getElementById('final-time');
    const finalMovesDisplay = document.getElementById('final-moves');
    const finalQuizDisplay = document.getElementById('final-quiz');
    const fameList = document.getElementById('fame-list');
    const quizModal = document.getElementById('quiz-modal');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');

    // Variáveis do jogo
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let pairsFound = 0;
    let moves = 0;
    let quizCorrect = 0;
    let quizTotal = 0;
    let timer;
    let seconds = 0;
    let gameStarted = false;
    let currentCharacter = null;
    let currentQuestionIndex = 0;

    // Inicialização
    initGame();

    // Event Listeners
    startButton.addEventListener('click', startGame);
    homeButton.addEventListener('click', resetGame);
    saveButton.addEventListener('click', saveScore);
    restartButton.addEventListener('click', restartGame);

    // Funções do jogo
    function initGame() {
        loadHallOfFame();
        createBoard();
    }

    function createBoard() {
        memoryBoard.innerHTML = '';
        cards = [];
        
        // Duplica as cartas e embaralha
        const gameCards = [];
        cardData.forEach(character => {
            gameCards.push({...character});
            gameCards.push({...character});
        });
        
        shuffleArray(gameCards);

        // Cria as cartas no DOM
        gameCards.forEach((character, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.image = character.image;
            card.dataset.character = JSON.stringify(character);

            const frontFace = document.createElement('div');
            frontFace.classList.add('card-face', 'card-front');

            const backFace = document.createElement('div');
            backFace.classList.add('card-face', 'card-back');

            const img = document.createElement('img');
            img.src = character.image;
            img.alt = 'Personagem One Piece';
            img.loading = 'lazy';

            backFace.appendChild(img);
            card.appendChild(frontFace);
            card.appendChild(backFace);
            card.addEventListener('click', flipCard);

            memoryBoard.appendChild(card);
            cards.push(card);
        });
    }

    function flipCard() {
        if (!gameStarted) return;
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.image === secondCard.dataset.image;

        if (isMatch) {
            disableCards();
            pairsFound++;
            pairsDisplay.textContent = `${pairsFound}/${cardData.length}`;
            
            // Mostra quiz quando encontrar um par
            currentCharacter = JSON.parse(firstCard.dataset.character);
            showQuiz();
            
            if (pairsFound === cardData.length) {
                endGame();
            }
        } else {
            unflipCards();
        }
    }

    function showQuiz() {
        if (!currentCharacter || currentCharacter.questions.length === 0) return;
        
        currentQuestionIndex = Math.floor(Math.random() * currentCharacter.questions.length);
        quizTotal++;
        
        quizQuestion.textContent = currentCharacter.questions[currentQuestionIndex];
        quizOptions.innerHTML = '';
        
        currentCharacter.answers[currentQuestionIndex].forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.addEventListener('click', () => checkQuizAnswer(index));
            quizOptions.appendChild(button);
        });
        
        quizFeedback.textContent = '';
        quizModal.style.display = 'flex';
        lockBoard = true;
    }

    function checkQuizAnswer(selectedIndex) {
        const isCorrect = selectedIndex === currentCharacter.correct[currentQuestionIndex];
        
        if (isCorrect) {
            quizCorrect++;
            quizFeedback.textContent = "Resposta Correta!";
            quizFeedback.style.color = "#4CAF50";
        } else {
            quizFeedback.textContent = `Resposta Incorreta! A correta era: ${currentCharacter.answers[currentQuestionIndex][currentCharacter.correct[currentQuestionIndex]]}`;
            quizFeedback.style.color = "#F44336";
        }
        
        setTimeout(() => {
            quizModal.style.display = 'none';
            lockBoard = false;
        }, 2000);
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function startGame() {
        startScreen.style.opacity = '0';
        
        setTimeout(() => {
            startScreen.style.display = 'none';
            gameContainer.style.display = 'flex';
            
            cards.forEach(card => card.classList.add('flipped'));
            
            setTimeout(() => {
                cards.forEach(card => card.classList.remove('flipped'));
                gameStarted = true;
                startTimer();
            }, 2000);
        }, 500);
    }

    function startTimer() {
        timer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function endGame() {
        stopTimer();
        gameStarted = false;
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        finalTimeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        finalMovesDisplay.textContent = moves;
        finalQuizDisplay.textContent = `${quizCorrect}/${quizTotal}`;
        
        setTimeout(() => {
            winScreen.style.display = 'flex';
        }, 1000);
    }

    function resetGame() {
        // Reseta todas as variáveis
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        pairsFound = 0;
        moves = 0;
        seconds = 0;
        quizCorrect = 0;
        quizTotal = 0;
        gameStarted = false;
        
        // Reseta a exibição
        pairsDisplay.textContent = `0/${cardData.length}`;
        movesDisplay.textContent = '0';
        timerDisplay.textContent = '00:00';
        
        stopTimer();
        winScreen.style.display = 'none';
        gameContainer.style.display = 'none';
        startScreen.style.display = 'flex';
        startScreen.style.opacity = '1';
        
        createBoard();
    }

    function restartGame() {
        // Similar ao resetGame mas mantém na tela do jogo
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        pairsFound = 0;
        moves = 0;
        seconds = 0;
        quizCorrect = 0;
        quizTotal = 0;
        gameStarted = false;
        
        pairsDisplay.textContent = `0/${cardData.length}`;
        movesDisplay.textContent = '0';
        timerDisplay.textContent = '00:00';
        
        stopTimer();
        winScreen.style.display = 'none';
        
        createBoard();
        
        cards.forEach(card => card.classList.add('flipped'));
        
        setTimeout(() => {
            cards.forEach(card => card.classList.remove('flipped'));
            gameStarted = true;
            startTimer();
        }, 2000);
    }

    function saveScore() {
        const playerName = prompt('Digite seu nome para o Hall da Fama:');
        if (!playerName) return;

        const score = {
            name: playerName,
            time: seconds,
            moves: moves,
            quiz: `${quizCorrect}/${quizTotal}`,
            date: new Date().toLocaleDateString()
        };

        const scores = JSON.parse(localStorage.getItem('onePieceMemoryScores')) || [];
        scores.push(score);
        
        scores.sort((a, b) => {
            if (a.time !== b.time) return a.time - b.time;
            if (a.moves !== b.moves) return a.moves - b.moves;
            return (b.quiz.split('/')[0]/b.quiz.split('/')[1]) - (a.quiz.split('/')[0]/a.quiz.split('/')[1]);
        });

        const topScores = scores.slice(0, 10);
        localStorage.setItem('onePieceMemoryScores', JSON.stringify(topScores));
        loadHallOfFame();

        saveButton.innerHTML = '<img src="assets/imgs/check-icon.png" alt="Salvo"> Salvo com sucesso!';
        setTimeout(() => {
            saveButton.innerHTML = '<img src="assets/imgs/trophy-icon.png" alt="Salvar"> Salvar Pontuação';
        }, 2000);
    }

    function loadHallOfFame() {
        const scores = JSON.parse(localStorage.getItem('onePieceMemoryScores')) || [];
        fameList.innerHTML = '';

        if (scores.length === 0) {
            fameList.innerHTML = '<li class="empty-message">Nenhum recorde ainda</li>';
            return;
        }

        scores.forEach((score, index) => {
            const li = document.createElement('li');
            const minutes = Math.floor(score.time / 60);
            const seconds = score.time % 60;
            const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            li.innerHTML = `
                <span class="player-rank">${index + 1}.</span>
                <span class="player-name">${score.name}</span>
                <span class="player-time">${timeFormatted}</span>
                <span class="player-moves">${score.moves} mov</span>
                <span class="player-quiz">${score.quiz} quiz</span>
            `;
            fameList.appendChild(li);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});