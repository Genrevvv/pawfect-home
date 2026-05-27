export function displayMessage(message, time = 3000) {
    const messageOverlay = document.getElementById('message-overlay');
    messageOverlay.style.visibility = 'visible';
    messageOverlay.innerText = message;

    setTimeout(() => {
        messageOverlay.style.visibility = 'hidden';
    }, time);
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

export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function truncateString(str, len) {
    return str.length > len ? str.slice(0, len) + '...' : str;
}

export function formatNumber(price) {
    return Number(price).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}