import { loginScript } from "./login.js";

window.history.pushState(null, "", "/");

const loginBtn = document.getElementById('login-button');

loginBtn.onclick = () => {
    const overlayContainer = document.getElementById('overlay-container');
    overlayContainer.style.visibility = 'visible';
    document.body.style.overflowY = 'hidden';

    fetch('html/login.html')
        .then(res => res.text())
        .then(html => {
            overlayContainer.innerHTML = html;
            loginScript();
        })
    }