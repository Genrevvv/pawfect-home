export function displayMessage(message) {
    const messageOverlay = document.getElementById('message-overlay');
    messageOverlay.style.visibility = 'visible';
    messageOverlay.innerText = message;

    setTimeout(() => {
        messageOverlay.style.visibility = 'hidden';
    }, 3000);
}