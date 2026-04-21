const form = document.querySelector('.order-form');
const beveragesList = document.querySelector('.beverages-list');
const addButton = document.querySelector('.add-button');

const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');
const modalCloseButton = document.querySelector('.modal-close');
const orderCountText = document.querySelector('.order-count-text');
const orderTableBody = document.querySelector('.order-table tbody');

function getBeverages() {
    return Array.from(beveragesList.querySelectorAll('.beverage'));
}

function updateDeleteButtonsState() {
    const beverages = getBeverages();
    const isSingleBeverage = beverages.length === 1;

    beverages.forEach((beverage) => {
        const removeButton = beverage.querySelector('.remove-button');
        removeButton.disabled = isSingleBeverage;
    });
}

function updateBeverageNumbers() {
    getBeverages().forEach((beverage, index) => {
        const orderNumber = index + 1;
        beverage.dataset.index = String(orderNumber);
        beverage.querySelector('.beverage-count').textContent = `Напиток №${orderNumber}`;

        beverage.querySelectorAll('input[type="radio"]').forEach((radio) => {
            radio.name = `milk-${orderNumber}`;
        });
    });
}

function resetBeverageFields(beverage) {
    const select = beverage.querySelector('.beverage-select');
    const milkRadios = beverage.querySelectorAll('input[type="radio"]');
    const optionCheckboxes = beverage.querySelectorAll('input[type="checkbox"]');

    select.value = 'capuccino';

    milkRadios.forEach((radio) => {
        radio.checked = radio.value === 'usual';
    });

    optionCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
}

function addBeverage() {
    const firstBeverage = getBeverages()[0];
    const newBeverage = firstBeverage.cloneNode(true);

    resetBeverageFields(newBeverage);
    beveragesList.append(newBeverage);

    updateBeverageNumbers();
    updateDeleteButtonsState();
}

function removeBeverage(button) {
    const beverages = getBeverages();

    if (beverages.length === 1) {
        return;
    }

    button.closest('.beverage').remove();
    updateBeverageNumbers();
    updateDeleteButtonsState();
}

addButton.addEventListener('click', addBeverage);

beveragesList.addEventListener('click', (event) => {
    const removeButton = event.target.closest('.remove-button');

    if (!removeButton) {
        return;
    }

    removeBeverage(removeButton);
});

updateBeverageNumbers();
updateDeleteButtonsState();

function openModal() {
    modal.classList.remove('hidden');
    modalOverlay.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
    modalOverlay.classList.add('hidden');
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    openModal();
});

modalCloseButton.addEventListener('click', closeModal);