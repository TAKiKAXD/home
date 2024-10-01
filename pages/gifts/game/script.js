const items = [
    { name: "Coal", probability: 20, icon: "images/Coal.png" },
    { name: "Coconut", probability: 10, icon: "images/Coconut.png" },
    { name: "Corn", probability: 15, icon: "images/Corn.png" },
    { name: "Daily Coin", probability: 20, icon: "images/Daily Coin.png" },
    { name: "Gold", probability: 5, icon: "images/Gold.png" },
    { name: "Subwafer", probability: 10, icon: "images/Subwafer.png" },
    { name: "Upgrade Llama", probability: 10, icon: "images/Upgrade.png" },
    { name: "Vbuck", probability: 5, icon: "images/Vbuck.png" },
    { name: "Candy Ticket", probability: 4, icon: "images/Candy Ticket.png" },
    { name: "Chest", probability: 1, icon: "images/Chest.png" },
    { name: "Xray Ticket", probability: 1, icon: "images/Xray Ticket.png" },
    { name: "Husk", probability: 0.0000001, icon: "images/Husk.png" }
];

let collectedItems = JSON.parse(localStorage.getItem("collectedItems")) || {};
let giftData = JSON.parse(localStorage.getItem("giftData")) || { count: 0, resetTime: null };

const maxGifts = 5; 
let giftsOpened = giftData.count;
let clickCount = 0;

updateGiftsLeftDisplay();

function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; 
    return `${formattedHours}:${minutes} ${ampm}`;
}

function calculateNextResetTime() {
    const now = new Date();
    const resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0); 

    if (now > resetTime) {
        resetTime.setDate(resetTime.getDate() + 1);
    }

    return resetTime.getTime();
}

function canOpenGift() {
    const now = Date.now();

    if (!giftData.resetTime || now > giftData.resetTime) {
        giftData.count = 0;
        giftData.resetTime = calculateNextResetTime();
        localStorage.setItem("giftData", JSON.stringify(giftData));
        giftsOpened = 0;
        updateGiftsLeftDisplay();
    }

    if (giftData.count >= maxGifts) {
        const resetDate = new Date(giftData.resetTime);
        const formattedResetTime = formatTime(resetDate);
        document.getElementById("outOfGiftsText").textContent = `You have opened all your gifts for today! Gifts will reset at ${formattedResetTime}.`;
        document.getElementById("outOfGiftsModal").style.display = "flex";
        return false;
    }
    return true;
}

document.getElementById("giftImage").addEventListener("click", function() {
    if (!canOpenGift()) {
        return; 
    }
    
    clickCount++;
    this.classList.add("shake");
    
    setTimeout(() => {
        this.classList.remove("shake");
    }, 500);

    if (clickCount >= 5) {
        openGift();
        clickCount = 0; 
    }
});

function openGift() {
    const randomItem = getRandomItem();
    showPopup(randomItem);

    if (!collectedItems[randomItem.name]) {
        collectedItems[randomItem.name] = 0;
    }
    collectedItems[randomItem.name]++;
    localStorage.setItem("collectedItems", JSON.stringify(collectedItems));

    giftData.count++;

    if (!giftData.resetTime) {
        giftData.resetTime = calculateNextResetTime(); 
    }
    localStorage.setItem("giftData", JSON.stringify(giftData));

    giftsOpened++;
    updateGiftsLeftDisplay();

    if (giftsOpened >= maxGifts) {
        const resetDate = new Date(giftData.resetTime);
        const formattedResetTime = formatTime(resetDate);
        document.getElementById("outOfGiftsText").textContent = `You have opened all your gifts for today! Gifts will reset at ${formattedResetTime}.`;
        document.getElementById("outOfGiftsModal").style.display = "flex";
    }
}

function updateGiftsLeftDisplay() {
    const giftsLeft = maxGifts - giftsOpened;
    document.getElementById("giftsLeft").textContent = `You have ${giftsLeft}/${maxGifts} gifts left`;
}

function getRandomItem() {
    const rand = Math.random() * 100;
    let cumulativeProbability = 0;
    for (let item of items) {
        cumulativeProbability += item.probability;
        if (rand < cumulativeProbability) {
            return item;
        }
    }
}

function showPopup(item) {
    const popup = document.getElementById("itemPopup");
    const popupImage = document.getElementById("popupImage");
    const popupText = document.getElementById("popupText");
    let timeoutId; 

    popupImage.src = item.icon;
    popupText.textContent = `You received a ${item.name}!`;
    popup.classList.remove("hidden");
    popup.classList.add("visible");

    timeoutId = setTimeout(() => {
        popup.classList.remove("visible");
        popup.classList.add("hidden");
    }, 3000);

    popup.addEventListener("click", function () {
        clearTimeout(timeoutId); 
        popup.classList.remove("visible");
        popup.classList.add("hidden");
    });
}

document.getElementById("viewItems").addEventListener("click", function() {
    const itemsList = document.getElementById("itemsList");
    itemsList.innerHTML = ''; 
    for (let item of items) {
        const count = collectedItems[item.name] || 0;
        const listItem = document.createElement("li");
        const iconImg = document.createElement("img");
        iconImg.src = item.icon;
        listItem.appendChild(iconImg);
        const itemText = document.createTextNode(`${item.name}: ${count}`);
        listItem.appendChild(itemText);
        itemsList.appendChild(listItem);
    }
    document.getElementById("itemsModal").style.display = "flex";
});

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("itemsModal").style.display = "none";
});

window.onclick = function(event) {
    const modal = document.getElementById("itemsModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

document.getElementById("closeOutOfGiftsModal").onclick = function () {
    document.getElementById("outOfGiftsModal").style.display = "none";
};

window.onclick = function (event) {
    const modal = document.getElementById("outOfGiftsModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
