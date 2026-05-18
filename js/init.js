export let cartItems = [];

window.addEventListener('beforeunload', () => {
    localStorage.setItem(`cart_items`, JSON.stringify(cartItems));
    // localStorage.removeItem('cart_items');
});

window.addEventListener('load', () => {
    const raw = localStorage.getItem('cart_items');
    if (!raw) return;

    cartItems = JSON.parse(raw);
    console.log(cartItems);

    if (cartItems.length > 0) {
        const cartItemCount =document.getElementById('cart-item-count');
        cartItemCount.style.visibility = 'visible';
        cartItemCount.innerHTML = cartItems.length;
    }
})