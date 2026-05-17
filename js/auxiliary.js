export function displayMessage(message) {
    const messageOverlay = document.getElementById('message-overlay');
    messageOverlay.style.visibility = 'visible';
    messageOverlay.innerText = message;

    setTimeout(() => {
        messageOverlay.style.visibility = 'hidden';
    }, 3000);
}

export function setupAdminButton() {
    const headerOptions = document.getElementById('header-options');
    console.log("You are an admin");

    const adminPage = document.createElement('div');
    adminPage.id = 'admin-page';
    adminPage.innerText = 'Admin Page';
    adminPage.onclick = () => { window.location.href = '/admin-page' }

    headerOptions.prepend(adminPage);
}

export async function updateContent(htmlFilePath, parentContainer) {
    const res = await fetch(htmlFilePath);
    const html = await res.text();
    parentContainer.innerHTML = html;
}