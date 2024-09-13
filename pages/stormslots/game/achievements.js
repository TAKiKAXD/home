function loadAchievements() {
    const savedAchievements = JSON.parse(localStorage.getItem('achievements')) || {};
    
    document.getElementById('status-image1').textContent = savedAchievements.image1 ? 'Unlocked' : 'Locked';
    document.getElementById('status-image2').textContent = savedAchievements.image2 ? 'Unlocked' : 'Locked';
    document.getElementById('status-image3').textContent = savedAchievements.image3 ? 'Unlocked' : 'Locked';
    document.getElementById('status-image4').textContent = savedAchievements.image4 ? 'Unlocked' : 'Locked';
    document.getElementById('status-image5').textContent = savedAchievements.image5 ? 'Unlocked' : 'Locked';
    document.getElementById('status-image6').textContent = savedAchievements.image6 ? 'Unlocked' : 'Locked';
    document.getElementById('status-image7').textContent = savedAchievements.image7 ? 'Unlocked' : 'Locked';
    document.getElementById('status-image8').textContent = savedAchievements.image8 ? 'Unlocked' : 'Locked';
}

document.addEventListener('DOMContentLoaded', loadAchievements);

function goBack() {
    window.location.href = 'index.html';
}
