import { getCartItemsCount, saveCartData } from "./cart.js";

export let cartItems = [];
export let cartItemsCount = 0;

window.addEventListener('beforeunload', () => {
    localStorage.setItem('cart_items', JSON.stringify(cartItems));
    // localStorage.removeItem('cart_items');
});

window.addEventListener('load', () => {
    if (!sessionStorage.getItem('username')) return;

    const raw = localStorage.getItem('cart_items');
    if (!raw) return;

    cartItems = JSON.parse(raw);
    cartItemsCount = getCartItemsCount();

    saveCartData();

    console.log(cartItemsCount);

    if (cartItemsCount > 0) {
        const cartItemCount =document.getElementById('cart-item-count');
        cartItemCount.style.visibility = 'visible';
        cartItemCount.innerHTML = cartItemsCount;
    }
})