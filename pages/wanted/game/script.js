const imageContainer = document.getElementById('image-container');
const message = document.getElementById('message');
const currentStageElem = document.getElementById('current-stage');
const highestStageElem = document.getElementById('highest-stage');

const imageUrls = {
    correct: 'images/medkit.png', 
    incorrect: 'images/minillama.png' 
};

let stage = 1;
let highestStage = loadHighestStage(); 
const initialImageSize = 100; 
const minImageSize = 30; 

function generateImages() {
    imageContainer.innerHTML = '';
    const totalImages = 5 + stage; 
    const correctIndex = Math.floor(Math.random() * totalImages);

    const imageSize = Math.max(minImageSize, initialImageSize - (stage * 5)); 
    const positions = generateUniquePositions(totalImages, imageSize);

    console.log(`Generating ${totalImages} images at stage ${stage} with size ${imageSize}`);
    console.log(`Positions:`, positions);

    for (let i = 0; i < totalImages; i++) {
        const img = document.createElement('img');
        img.src = i === correctIndex ? imageUrls.correct : imageUrls.incorrect;
        img.style.width = `${imageSize}px`;
        img.style.height = `${imageSize}px`;
        img.addEventListener('click', () => handleImageClick(i === correctIndex));

        
        img.style.position = 'absolute'; 
        img.style.left = `${positions[i].x}px`;
        img.style.top = `${positions[i].y}px`;

        imageContainer.appendChild(img);
    }
}

function generateUniquePositions(count, imageSize) {
    const positions = [];
    const maxX = imageContainer.clientWidth - imageSize;
    const maxY = imageContainer.clientHeight - imageSize;

    while (positions.length < count) {
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        const isOverlap = positions.some(pos => 
            Math.abs(pos.x - x) < imageSize && Math.abs(pos.y - y) < imageSize
        );

        if (!isOverlap) {
            positions.push({ x, y });
        }

        if (positions.length === count) break;
    }

    return positions;
}

function handleImageClick(isCorrect) {
    if (isCorrect) {
        if (stage >= 120) {
            displayWinScreen(); 
        } else {
            message.textContent = 'Correct! Moving to the next stage...';
            stage++;
            if (stage > highestStage) {
                highestStage = stage; 
                saveHighestStage(highestStage);
            }
            updateStageInfo();
            setTimeout(() => {
                generateImages();
                message.textContent = 'Find the MedKit!';
            }, 1000); 
        }
    } else {
        message.textContent = 'Try again! Resetting to Stage 1.';
        stage = 1; 
        updateStageInfo();
        setTimeout(() => {
            generateImages();
            message.textContent = 'Find the MedKit';
        }, 1000);
    }
}

function updateStageInfo() {
    currentStageElem.textContent = `Stage: ${stage}`;
    highestStageElem.textContent = `Highest Stage: ${highestStage}`;
}

function saveHighestStage(stage) {
    localStorage.setItem('highestStage', stage);
}

function loadHighestStage() {
    const savedStage = localStorage.getItem('highestStage');
    return savedStage ? parseInt(savedStage, 10) : 1; 
}

function displayWinScreen() {
    window.location.href = 'win.html';
}


// Initialize the game
generateImages();
updateStageInfo();
