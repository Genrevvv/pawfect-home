export function cartScript() {
    const cartContainer = document.getElementById('cart-container');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartPanel = document.getElementById('cart-panel');
    const closeBtn = document.getElementById('close-cart');

    function closeCartFunction() {
        cartPanel.style.animation = 'SlideOut 0.3s ease forwards';

        cartPanel.addEventListener('animationend', () => {
            cartContainer.remove();
        }, { once: true });
    }

    closeBtn.onclick = closeCartFunction;

    cartOverlay.onclick = (e) => {
        if (e.target === cartOverlay) {
            closeCartFunction();
        }
    };
}