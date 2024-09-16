const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const spinButton = document.getElementById('spin-btn');
const resultDisplay = document.getElementById('result');
const scoreDisplay = document.getElementById('score');

const baseImagePoints = {
    0: 500,  
    1: 1000, 
    2: 1500, 
    3: 2000, 
    4: 2500, 
    5: 3000, 
    6: 3500, 
    7: 4000  
};

let imagePoints = { ...baseImagePoints };

let score = 0;
let totalClicks = 0;
let vbucksEarned = 0;
let vbucksSpent = 0;
let startTime = Date.now(); 

function saveScore(score) {
    localStorage.setItem('slotMachineScore', score);
}

function getSavedScore() {
    return parseInt(localStorage.getItem('slotMachineScore')) || 0;
}

function saveStats() {
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('vbucksEarned', vbucksEarned);
    localStorage.setItem('vbucksSpent', vbucksSpent);
    localStorage.setItem('startTime', startTime);
    localStorage.setItem('timePlayed', Date.now() - startTime);
}

function getSavedStats() {
    totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
    vbucksEarned = parseInt(localStorage.getItem('vbucksEarned')) || 0;
    vbucksSpent = parseInt(localStorage.getItem('vbucksSpent')) || 0;
    startTime = parseInt(localStorage.getItem('startTime')) || Date.now();
}

function saveLastSpinResults(reel1Index, reel2Index, reel3Index, resultText) {
    localStorage.setItem('lastReel1Index', reel1Index);
    localStorage.setItem('lastReel2Index', reel2Index);
    localStorage.setItem('lastReel3Index', reel3Index);
    localStorage.setItem('lastResultText', resultText);
}

function getLastSpinResults() {
    return {
        reel1Index: parseInt(localStorage.getItem('lastReel1Index')) || 0,
        reel2Index: parseInt(localStorage.getItem('lastReel2Index')) || 0,
        reel3Index: parseInt(localStorage.getItem('lastReel3Index')) || 0,
        resultText: localStorage.getItem('lastResultText') || ''
    };
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Vbucks: ${score}`;
}

function getRandomImageIndex() {
    return Math.floor(Math.random() * Object.keys(imagePoints).length);
}

function displayRandomImage(reel) {
    const children = reel.children;
    const randomIndex = getRandomImageIndex();
    
    Array.from(children).forEach((img, index) => {
        img.style.display = 'none'; 
        if (index === randomIndex) {
            img.style.display = 'block'; 
        }
    });
    
    return randomIndex;
}

function checkWin(reel1Index, reel2Index, reel3Index) {
    let points = 0;
    if (reel1Index === reel2Index && reel2Index === reel3Index) {
        points = imagePoints[reel1Index];
    }
    return points;
}

function spin(isAutoSpin = false) {
    totalClicks++;
    spinButton.disabled = true;

    let isHardcore = localStorage.getItem('hardcoreMode') === 'true';
    
    if (isAutoSpin) {
        if (score >= 100) {
            score -= 100;  
            vbucksSpent += 100;
        } else {
            resultDisplay.textContent = 'Not enough V-Bucks for auto-spin!';
            stopAutoSpin();
            spinButton.disabled = false;
            return;
        }
    }

    if (isHardcore) {
        if (score >= 500) {
            score -= 500;  
            vbucksSpent += 500;
        } else if (isAutoSpin) { 
            resultDisplay.textContent = 'Not enough V-Bucks for storm mode!';
            stopAutoSpin();
            spinButton.disabled = false;
            return;
        } else {
            resultDisplay.textContent = 'Not enough V-Bucks for storm mode!';
            spinButton.disabled = false;
            return;
        }
    }

    const reel1Result = displayRandomImage(reel1);
    const reel2Result = displayRandomImage(reel2);
    const reel3Result = displayRandomImage(reel3);

    let points = checkWin(reel1Result, reel2Result, reel3Result);

    if (isHardcore && points > 0) {
        points *= 2;  
    }

    let resultText;
    if (points > 0) {
        score += points;
        vbucksEarned += points;
        resultText = `You win! +${points} Vbucks!`;
        submitScoreToMongoDB(score);
    } else {
        resultText = 'Try again!';
    }

    resultDisplay.textContent = resultText;
    saveScore(score);
    saveStats();
    saveLastSpinResults(reel1Result, reel2Result, reel3Result, resultText);
    updateScoreDisplay();

    setTimeout(() => {
        spinButton.disabled = false;
    }, 500);
}

function applyHardcoreGlow() {
    const hardcoreMode = localStorage.getItem('hardcoreMode') === 'true';
    if (hardcoreMode) {
        document.body.classList.add('hardcore-active');  
    } else {
        document.body.classList.remove('hardcore-active');  
    }
}

function updateImageValues() {
    const hardcoreMode = localStorage.getItem('hardcoreMode') === 'true';
    imagePoints = { ...baseImagePoints };
    
    if (hardcoreMode) {
        for (let key in imagePoints) {
            imagePoints[key] *= 2;
        }
    }

    document.querySelectorAll('#image-values .image-value span').forEach((span, index) => {
        span.textContent = imagePoints[index] || 0;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    score = getSavedScore();
    getSavedStats();
    updateScoreDisplay();
    applyHardcoreGlow();
    updateImageValues();  
    
    const lastResults = getLastSpinResults();
    if (lastResults.resultText) {
        resultDisplay.textContent = lastResults.resultText;
        displayRandomImage(reel1);
        displayRandomImage(reel2);
        displayRandomImage(reel3);
    }
    startAutoSpin();
});

spinButton.addEventListener('click', () => {
    spin();  
    stopAutoSpin(); 
});

document.getElementById('stats-btn').addEventListener('click', () => {
    window.location.href = './Pages/stats.html';
});

document.getElementById('settings-btn').addEventListener('click', () => {
    window.location.href = './Pages/settings.html';
});

document.getElementById('debts-btn').addEventListener('click', () => {
    window.location.href = './Pages/debts.html';
});

document.getElementById('dev-btn').addEventListener('click', () => {
    score += 10000;
});

document.getElementById('hardcore-toggle').addEventListener('change', (event) => {
    localStorage.setItem('hardcoreMode', event.target.checked);
    applyHardcoreGlow();  
    updateImageValues();  
});

let autoSpinInterval;

function startAutoSpin() {
    const autoSpinEnabled = JSON.parse(localStorage.getItem('autoSpin')) || false;
    if (autoSpinEnabled) {
        autoSpinInterval = setInterval(() => {
            if (score >= 10) { 
                spin(true); 
            } else {
                stopAutoSpin(); 
            }
        }, 2000); 
    }
}

function stopAutoSpin() {
    if (autoSpinInterval) {
        clearInterval(autoSpinInterval);
        autoSpinInterval = null;
        localStorage.setItem('autoSpin', false); 
    }
}
