import { displayMessage, truncateString, updateContent } from "./auxiliary.js";
import { checkOutScript } from "./checkout.js";
import { logIn } from "./header-bar.js";
import { cartItems } from "./init.js";

export function cartScript() {
    const cartContainer = document.getElementById('cart-container');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartPanel = document.getElementById('cart-panel');
    const closeBtn = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    const cartBody = document.getElementById('cart-body');

    function closeCartFunction() {
        cartPanel.style.animation = 'SlideOut 0.3s ease forwards';

        cartPanel.addEventListener('animationend', () => {
            cartContainer.remove();
        }, { once: true });
    }

    function renderCartItem(product) {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${product.image}" alt="Dog Food">
            <div class="cart-item-details">
                <h3>${product.product_name}</h3>
                <p>${truncateString(product.description, 40)}</p>
                <div class="quantity-container">
                    <span>Quantity: </span>
                    <span class="quantity">${product.quantity}</span>
                    <div class="qty-btn-container">
                        <button class="qty-btn">−</button>
                        <button class="qty-btn">+</button>
                    </div>
                </div>
            </div>
            <div class="cart-item-price">₱${product.price}</div>
        `;

        cartBody.append(cartItem);

        const minusBtn = cartItem.querySelectorAll(".qty-btn")[0];
        const plusBtn = cartItem.querySelectorAll(".qty-btn")[1];
        const quantityText = cartItem.querySelector(".quantity");

        cartItem.addEventListener("click", () => {
            const index = cartItems.findIndex(i => i.id === product.id);
            if (index !== -1) cartItems.splice(index, 1);

            cartItem.remove();

            updateCartItemCount();
            updateTotalPrice();
        });

        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            product.quantity++;
            quantityText.textContent = product.quantity;

            updateCartItemCount();
            updateTotalPrice();
        });

        minusBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            if (product.quantity > 1) {
                product.quantity--;
                quantityText.textContent = product.quantity;

                updateCartItemCount();
                updateTotalPrice();
            }
        });
    }

    cartItems.forEach((product) => {
        if (product.quantity > 0) {
            renderCartItem(product);
        }
    });

    closeBtn.onclick = closeCartFunction;

    updateTotalPrice();
    updateCartItemCount();

    cartOverlay.onclick = (e) => {
        if (e.target === cartOverlay) {
            closeCartFunction();
        }
    };

    checkoutBtn.onclick = async () => {
        if (sessionStorage.getItem('username') === null) {
            closeCartFunction();
            logIn();
            return;
        }

        if (cartItems.filter(i => i.quantity > 0).length === 0) {
            displayMessage('Cart is empty');
            closeCartFunction();
            return;
        }

        const overlayContainer = document.getElementById('overlay-container');
        await updateContent('html/checkout.html', overlayContainer);

        overlayContainer.style.visibility = 'visible';
        document.body.style.overflowY = 'hidden';
        checkOutScript();
        closeCartFunction();
    };
}

export function getCardData() {
    fetch('/get-user-cart')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) return;

            localStorage.setItem('cart_items', JSON.stringify(data));
            cartItems.push(...data);

            updateCartItemCount();
        });
}

export function saveCartData() {
    const userCart = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    fetch('/save-user-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userCart)
    })
    .then(res => res.json())
    .then(data => console.log(data));
}

export function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }

    updateCartItemCount();
}

export function updateTotalPrice() {
    const totalPrice = document.getElementById('total-price');

    let total = 0;
    for (const item of cartItems) {
        total += item.price * item.quantity;
    }

    totalPrice.innerHTML = `₱${total}`;

    return total;
}

export function getCartItemsCount() {
    return cartItems.filter(item => item.quantity > 0).length;
}

export function updateCartItemCount() {
    const cartItemCount = document.getElementById('cart-item-count');

    const count = getCartItemsCount();

    if (count === 0) {
        cartItemCount.style.visibility = 'hidden';
        return;
    }

    cartItemCount.style.visibility = 'visible';
    cartItemCount.textContent = count;
}

export function clearCart() {
    cartItems.length = 0;
}