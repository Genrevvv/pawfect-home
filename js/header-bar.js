import { setupAdminButton } from "./auxiliary.js";
import { loginScript } from "./login.js";

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

export function logOut() {
    fetch('/user-logout')
        .then(res => res.json())
        .then(data => {
            if (data['success']) {
                sessionStorage.clear();
                window.location.href = '/'
            }
        });
}