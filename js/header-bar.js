const authBtn = document.getElementById('auth-btn');

if (sessionStorage.getItem('username')) {
    authBtn.innerText = 'LOG OUT';
    authBtn.onclick = logOut;
}
else {
    authBtn.onclick = logIn;
}

function logIn() {
    window.location.href = '/login';
}

function logOut() {
    fetch('/user-logout')
        .then(res => res.json())
        .then(data => {
            if (data['success']) {
                sessionStorage.removeItem('username');
                window.location.href = '/'
            }
        });
}