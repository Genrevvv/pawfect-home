import { displayMessage, setupAdminButton, updateContent } from "./auxiliary.js";
import { cartScript, saveCartData } from "./cart.js";
import { loginScript } from "./login.js";

const adoptionStatus = document.getElementById('adoption-status');
const authBtn = document.getElementById('auth-btn');
const cartBtn = document.getElementById('cart-btn');
const orderStatus = document.getElementById('order-status');
const overlayContainer = document.getElementById('overlay-container');

const onloadMessage = sessionStorage.getItem('onloadMessage');

if (onloadMessage) {
    displayMessage(onloadMessage, 4000);
    sessionStorage.removeItem('onloadMessage');
}

adoptionStatus.onclick = () => {
    if (sessionStorage.getItem('username') === null) {
        logIn();
        return;
    }
    
    window.location.href = '/adoption-status';
}

orderStatus.onclick = () => {
    if (sessionStorage.getItem('username') === null) {
        logIn();
        return;
    }
    
    window.location.href = '/order-status';
}

overlayContainer.onclick = (e) => {
    if (e.target != overlayContainer) {
        return;
    }
    
    overlayContainer.innerHTML = '';
    overlayContainer.style.visibility = 'hidden';
    document.body.style.overflowY = 'visible';
}

cartBtn.onclick = () => {
    cart();
}

if (sessionStorage.getItem('user_type') === 'admin') {
    setupAdminButton();
}

if (sessionStorage.getItem('username')) {
    authBtn.innerText = 'My Account';
    authBtn.onclick = displayAccountOptions;

    const deleteAccountBtn = document.getElementById('delete-account');
    const loginBtn = document.getElementById('logout');
    
    loginBtn.onclick = logOut;
    deleteAccountBtn.onclick = deleteAccount;
}
else {
    authBtn.onclick = logIn;
}

export function cart() {
    fetch('html/cart.html')
        .then(res => res.text())
        .then(html => {
            const cartContainer = document.createElement('div');
            cartContainer.id = 'cart-container';
            cartContainer.innerHTML = html;
            document.querySelector('main').append(cartContainer);
            cartScript();
        })
}

export function displayAccountOptions() {
    const accountOptions = document.getElementById('account-options');

    if (accountOptions.style.display === '') {
        accountOptions.style.display = 'none';
        return;
    }

    accountOptions.style.display = '';

    const deleteAccountBtn = document.getElementById('delete-account');
    const loginBtn = document.getElementById('logout');
    
    loginBtn.onclick = logOut;
    deleteAccountBtn.onclick = deleteAccount;
}

export function logIn() {
    overlayContainer.style.visibility = 'visible';
    document.body.style.overflowY = 'hidden';

    fetch('html/login.html')
        .then(res => res.text())
        .then(html => {
            overlayContainer.innerHTML = html;
            loginScript();
        });
}

export async function deleteAccount() {
    await updateContent('html/delete-account.html', overlayContainer);
    overlayContainer.style.visibility = 'visible';
    document.body.style.overflowY = 'hidden';

    const deleteAccountYes = document.getElementById('delete-account-yes');
    const deleteAccountNo = document.getElementById('delete-account-no');

    deleteAccountYes.onclick = () => {
    fetch('/delete-account')
        .then(res => res.json())
        .then(async data  => {
            if (data['success']) {
                await updateContent('html/goodbye.html', overlayContainer);

                localStorage.clear();
                sessionStorage.clear();
            }
        });
    }

    deleteAccountNo.onclick = () => {
        overlayContainer.innerHTML = '';
        overlayContainer.style.visibility = 'hidden';
        document.body.style.overflowY = 'visible';
    }

}

export async function logOut() {
    await saveCartData();

    fetch('/user-logout')
        .then(res => res.json())
        .then(data => {
            if (data['success']) {

                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/'
            }
        });
}