import { setupAdminButton } from "./auxiliary.js";
import { cartScript, saveCartData } from "./cart.js";
import { loginScript } from "./login.js";

const cartBtn = document.getElementById('cart-btn');
const authBtn = document.getElementById('auth-btn');
const overlayContainer = document.getElementById('overlay-container');

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
    authBtn.innerText = 'LOG OUT';
    authBtn.onclick = logOut;
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
            console.log('gfdsfdw');
        })
}

export function logIn() {
    overlayContainer.style.visibility = 'visible';
    document.body.style.overflowY = 'hidden';

    fetch('html/login.html')
        .then(res => res.text())
        .then(html => {
            overlayContainer.innerHTML = html;
            loginScript();
        })
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