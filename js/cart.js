import { cartItems } from "./init.js";

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

    const cartBody = document.getElementById('cart-body');
    cartItems.forEach((product) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item')
        cartItem.innerHTML = `
            <img src="${product.image}" alt="Dog Food">
            <div class="cart-item-details">
                <h3>${product.product_name}</h3>
                <p>${product.description}</p>
                <span>Quantity: ${product.quantity}</span>
            </div>
            <div class="cart-item-price">₱${product.price}</div>
        `;

        cartBody.append(cartItem);
    });

    closeBtn.onclick = closeCartFunction;

    cartOverlay.onclick = (e) => {
        if (e.target === cartOverlay) {
            closeCartFunction();
        }
    };
}

export function addToCart(product) {
    const cartItemCount = document.getElementById('cart-item-count');
    
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    }
    else {
        product.quantity = 1;
        cartItems.push(product);
    }

    console.log(cartItems)

    cartItemCount.style.visibility = 'visible';
    cartItemCount.innerHTML = cartItems.length;
}