/* Imports */
import {
    createList,
    getList,
    purchasedItem,
    deleteAllLists,
    deletePurchasedLists,
    getUser,
    deleteSpecifiedItem,
} from './fetch-utils.js';
// this will check if we have a user and set signout link if it exists
import './auth/user.js';

import { renderList } from './render-utils.js';

/* Get DOM Elements */
const addShoppingListForm = document.getElementById('add-shopping-list-form');
const errorDisplay = document.getElementById('error-display');
const shoppingList = document.getElementById('shopping-list');
const deleteAllButton = document.getElementById('delete-all-button');
const deletePurchasedButton = document.getElementById('delete-purchased-button');
// const deleteItemButton = document.getElementById('delete-item-button');

/* State */
let lists = [];
let error = null;
let user = getUser();
/* Events */
window.addEventListener('load', async () => {
    const response = await getList();
    lists = response.data;
    error = response.error;
    if (error) {
        displayError();
    }
    if (lists) {
        displayLists();
    }
});

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
        addShoppingListForm.reset();
    }
});

deleteAllButton.addEventListener('click', async () => {
    const response = await deleteAllLists();
    error = response.error;
    if (error) {
        displayError();
    } else {
        lists = [];
        displayLists();
    }
});

deletePurchasedButton.addEventListener('click', async () => {
    const response = await deletePurchasedLists(user.id);
    error = response.error;

    if (error) {
        displayError();
    } else {
        const toBuyLists = [];
        for (const list of lists) {
            if (!list.bought) {
                toBuyLists.push(list);
            }
        }
        lists = toBuyLists;
        displayLists();
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

        listEl.addEventListener('click', async () => {
            const response = await purchasedItem(list.id);
            error = response.error;
            const updatedList = response.data;

            if (error) {
                displayError();
            } else if (list.bought) {
                const response = deleteSpecifiedItem(list.id);
                error = response.error;

                if (error) {
                    displayError();
                } else {
                    const index = lists.indexOf(list);
                    if (index !== -1) {
                        lists.splice(index, 1);
                    }
                    displayLists();
                }
            } else {
                const index = lists.indexOf(list);
                lists[index] = updatedList;
                displayLists();
            }
        });
    }
}
