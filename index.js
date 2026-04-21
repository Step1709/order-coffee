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


function getDrinkWord(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
        return 'напиток';
    }

    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        return 'напитка';
    }

    return 'напитков';
}

function getCheckedOptionsText(beverage) {
    const checkedOptions = beverage.querySelectorAll('input[type="checkbox"]:checked');

    if (checkedOptions.length === 0) {
        return '—';
    }

    return Array.from(checkedOptions)
        .map((checkbox) => checkbox.dataset.label)
        .join(', ');
}

function collectOrderData() {
    return getBeverages().map((beverage) => {
        const selectedDrink = beverage.querySelector('.beverage-select option:checked');
        const selectedMilk = beverage.querySelector('input[type="radio"]:checked');

        return {
            drink: selectedDrink.dataset.label,
            milk: selectedMilk.dataset.label,
            options: getCheckedOptionsText(beverage),
        };
    });
}

function renderOrderTable(orderItems) {
    orderTableBody.innerHTML = orderItems
        .map((item) => {
            return `
        <tr>
          <td>${item.drink}</td>
          <td>${item.milk}</td>
          <td>${item.options}</td>
        </tr>
      `;
        })
        .join('');
}

function renderOrderSummary() {
    const orderItems = collectOrderData();
    const count = orderItems.length;

    orderCountText.textContent = `Вы заказали ${count} ${getDrinkWord(count)}`;
    renderOrderTable(orderItems);
}

updateBeverageNumbers();
updateDeleteButtonsState();