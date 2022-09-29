/* Imports */
import { createList } from './fetch-utils.js';
// this will check if we have a user and set signout link if it exists
import './auth/user.js';

import { renderList } from './render-utils.js';

/* Get DOM Elements */
const addShoppingListForm = document.getElementById('add-shopping-list-form');
const errorDisplay = document.getElementById('error-display');
const shoppingList = document.getElementById('shopping-list');
/* State */
let lists = [];
let error = null;

/* Events */
addShoppingListForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addShoppingListForm);
    const newList = {
        quantity: formData.get('quantity'),
        item: formData.get('item'),
    };
    const response = await createList(newList);
    error = response.error;
    const list = response.data;

    if (error) {
        displayError();
    } else {
        lists.push(list);
        displayLists();
        addShoppingListForm.requestFullscreen();
    }
});

/* Display Functions */
function displayError() {
    if (error) {
        errorDisplay.textContent = error.message;
    } else {
        errorDisplay.textContent = '';
    }
}

function displayLists() {
    shoppingList.innerHTML = '';

    for (const list of lists) {
        const listEl = renderList(list);
        shoppingList.append(listEl);
    }
}
