const homeLoanAmount = document.getElementById('home-loan-amount');
const carLoanAmount = document.getElementById('car-loan-amount');
const otherLoanAmount = document.getElementById('other-loan-amount');

const payHomeLoanBtn = document.getElementById('pay-home-loan-btn');
const payCarLoanBtn = document.getElementById('pay-car-loan-btn');
const payOtherLoanBtn = document.getElementById('pay-other-loan-btn');

const backBtn = document.getElementById('back-btn'); 
const resultDisplay = document.getElementById('result'); 

function loadDebts() {
    homeLoanAmount.innerHTML = formatDebt(localStorage.getItem('homeLoan') || '600000');
    carLoanAmount.innerHTML = formatDebt(localStorage.getItem('carLoan') || '30000');
    otherLoanAmount.innerHTML = formatDebt(localStorage.getItem('otherLoan') || '10000');

    updateButtonStates();
}

function formatDebt(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '<br>V-Bucks';
}

function getVbucks() {
    return parseInt(localStorage.getItem('slotMachineScore')) || 0;
}

function saveVbucks(vbucks) {
    localStorage.setItem('slotMachineScore', vbucks);
}

function saveDebts() {
    localStorage.setItem('homeLoan', homeLoanAmount.innerHTML.split('<br>')[0].replace(/,/g, ''));
    localStorage.setItem('carLoan', carLoanAmount.innerHTML.split('<br>')[0].replace(/,/g, ''));
    localStorage.setItem('otherLoan', otherLoanAmount.innerHTML.split('<br>')[0].replace(/,/g, ''));
}

function updateButtonStates() {
    updateButtonState('home-loan', payHomeLoanBtn);
    updateButtonState('car-loan', payCarLoanBtn);
    updateButtonState('other-loan', payOtherLoanBtn);
}

function updateButtonState(debtType, button) {
    const debtAmountElement = document.getElementById(`${debtType}-amount`);
    let debtAmount = parseInt(debtAmountElement.innerHTML.split('<br>')[0].replace(/,/g, '')) || 0;

    if (debtAmount === 0) {
        debtAmountElement.innerHTML = 'PAID';
        button.disabled = true;
        button.textContent = 'Paid';
    } else {
        button.disabled = false;
        button.textContent = `Pay ${formatDebt(debtAmount).split('<br>')[0]}`;
    }
}

function payDebt(debtType) {
    const debtAmountElement = document.getElementById(`${debtType}-amount`);
    let debtAmount = parseInt(debtAmountElement.innerHTML.split('<br>')[0].replace(/,/g, '')) || 0;
    let vbucks = getVbucks();

    if (vbucks >= debtAmount && debtAmount > 0) {
        vbucks -= debtAmount;
        debtAmountElement.innerHTML = '0<br>V-Bucks';
        saveVbucks(vbucks);
        saveDebts();
        updateButtonStates();
        resultDisplay.textContent = 'Debt paid successfully!';
        resultDisplay.style.color = '#00ff00'; 
    } else {
        resultDisplay.textContent = 'Not enough V-Bucks or debt already paid!';
        resultDisplay.style.color = '#ff0000'; 
    }
}

function handleBackButtonClick() {
    window.history.back();
}

payHomeLoanBtn.addEventListener('click', () => payDebt('home-loan'));
payCarLoanBtn.addEventListener('click', () => payDebt('car-loan'));
payOtherLoanBtn.addEventListener('click', () => payDebt('other-loan'));

backBtn.addEventListener('click', handleBackButtonClick);

loadDebts();
