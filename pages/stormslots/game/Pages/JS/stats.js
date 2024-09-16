document.addEventListener('DOMContentLoaded', () => {
    const totalClicks = localStorage.getItem('totalClicks') || 0;
    const vbucksEarned = localStorage.getItem('vbucksEarned') || 0;
    const vbucksSpent = localStorage.getItem('vbucksSpent') || 0;
    const startTime = localStorage.getItem('startTime') || Date.now();

    updateStats(totalClicks, vbucksEarned, vbucksSpent, startTime);

    setInterval(() => {
        updateStats(totalClicks, vbucksEarned, vbucksSpent, startTime);
    }, 1000); 
});

function updateStats(totalClicks, vbucksEarned, vbucksSpent, startTime) {
    const currentTime = Date.now();
    const timePlayed = currentTime - startTime;

    document.getElementById('total-clicks').textContent = totalClicks;
    document.getElementById('vbucks-earned').textContent = vbucksEarned;
    document.getElementById('vbucks-spent').textContent = vbucksSpent;
    document.getElementById('time-played').textContent = formatTimePlayed(timePlayed);
}

function formatTimePlayed(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
}

function goBack() {
    window.location.href = '../index.html';
}
