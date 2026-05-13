import { displayMessage, setupAdminButton } from "./auxiliary.js";
import { logOut } from "./header-bar.js";
import { registerScript } from "./register.js";

export function loginScript() {
    const authBtn = document.getElementById('auth-btn');
    const form = document.getElementById('form');
    const overlayContainer = document.getElementById('overlay-container');
    const toRegister = document.getElementById('to-register');

    const input = {
        username: document.getElementById('username'),
        password: document.getElementById('password')
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = input.username.value;
        const password = input.password.value;

        if (username.length > 0 && password.length > 0) {
            const data = { username, password };
            const options = {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(data)
            }

            fetch('/user-login', options)
                .then(res => res.json())
                .then(data => {
                    console.log(data);

                    if (!data['success']) {
                        document.getElementById('message').innerHTML = data['error'];
                        return;
                    }

                    sessionStorage.setItem('username', data['username']);
                    sessionStorage.setItem('user_type', data['user_type']);

                    authBtn.innerText = 'LOG OUT';
                    authBtn.onclick = logOut;
                    overlayContainer.style.visibility = 'hidden';
                    document.body.style.overflowY = 'visible';

                    if (sessionStorage.getItem('user_type') === 'admin') {
                        setupAdminButton();
                    }

                    displayMessage('Login Successful');
                });
        }
    });

    toRegister.onclick = () => {
        fetch('html/register.html')
            .then(res => res.text())
            .then(html => {
                overlayContainer.innerHTML = html;
                registerScript();
            })
    }
}
