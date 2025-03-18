let tg = window.Telegram.WebApp;
tg.expand();

const gameBoard = document.getElementById('gameBoard');
const attemptsCounter = document.getElementById('attempts');
const restartButton = document.getElementById('restartButton');
const splashScreen = document.getElementById('splashScreen');
const gameContainer = document.getElementById('gameContainer');
const startButton = document.getElementById('startButton');

let attempts = 0;
let flippedCards = [];
let matchedPairs = 0;

// Замените пути к изображениям на ваши
const images = [
    'images/photo1.jpg',
    'images/photo2.jpg',
    'images/photo3.jpg',
    'images/photo4.jpg',
    'images/photo5.jpg',
    'images/photo6.jpg',
    'images/photo7.jpg',
    'images/photo8.jpg',
    'images/photo9.jpg'
];

// Создаем дубликаты карточек
const cards = [...images, ...images];

function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(imagePath) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const front = document.createElement('div');
    front.className = 'card-front';
    
    const back = document.createElement('div');
    back.className = 'card-back';
    
    const img = document.createElement('img');
    img.src = imagePath;
    
    back.appendChild(img);
    card.appendChild(front);
    card.appendChild(back);
    
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (flippedCards.length === 2) return;
    if (this === flippedCards[0]) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        attempts++;
        attemptsCounter.textContent = attempts;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.querySelector('img').src === card2.querySelector('img').src;

    if (match) {
        matchedPairs++;
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        if (matchedPairs === images.length) {
            setTimeout(() => {
                alert(`Поздравляем! Вы выиграли за ${attempts} попыток!`);
            }, 500);
        }
    } else {
        card1.classList.add('wrong');
        card2.classList.add('wrong');
        setTimeout(() => {
            card1.classList.remove('flipped', 'wrong');
            card2.classList.remove('flipped', 'wrong');
            flippedCards = [];
        }, 1000);
    }
}

restartButton.addEventListener('click', () => {
    attempts = 0;
    matchedPairs = 0;
    flippedCards = [];
    attemptsCounter.textContent = attempts;
    
    gameBoard.innerHTML = '';
    
    initGame();
});

function initGame() {
    const shuffledCards = shuffleCards(cards);
    shuffledCards.forEach(imagePath => {
        const card = createCard(imagePath);
        gameBoard.appendChild(card);
    });
}

function hideSplashScreen() {
    splashScreen.style.opacity = '0';
    splashScreen.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        splashScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        gameContainer.style.opacity = '0';
        setTimeout(() => {
            gameContainer.style.opacity = '1';
            gameContainer.style.transition = 'opacity 0.5s ease';
        }, 50);
    }, 500);
}

startButton.addEventListener('click', hideSplashScreen);

initGame(); 