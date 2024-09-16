document.getElementById('clear-data').addEventListener('click', () => {
    localStorage.clear();
    alert('All data cleared!');
});

document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '../index.html';
});

const hardcoreToggle = document.getElementById('hardcore-toggle');

document.addEventListener('DOMContentLoaded', () => {
    const hardcoreMode = JSON.parse(localStorage.getItem('hardcoreMode')) || false;
    hardcoreToggle.checked = hardcoreMode;
});

hardcoreToggle.addEventListener('change', () => {
    localStorage.setItem('hardcoreMode', hardcoreToggle.checked);
});
document.getElementById('auto-spin-toggle').addEventListener('change', () => {
    localStorage.setItem('autoSpin', JSON.stringify(document.getElementById('auto-spin-toggle').checked));
});

document.addEventListener('DOMContentLoaded', () => {
    const autoSpin = JSON.parse(localStorage.getItem('autoSpin')) || false;
    document.getElementById('auto-spin-toggle').checked = autoSpin;
});

