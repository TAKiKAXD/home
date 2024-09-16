document.getElementById('accept-btn').addEventListener('click', () => {
    localStorage.setItem('disclaimerAccepted', 'true');

    window.location.href = '../index.html';
});
