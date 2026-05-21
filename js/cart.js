import { truncateString, updateContent } from "./auxiliary.js";
import { checkOutScript } from "./checkout.js";
import { cartItems } from "./init.js";

export function cartScript() {
    const cartContainer = document.getElementById('cart-container');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartPanel = document.getElementById('cart-panel');
    const closeBtn = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn')

    function closeCartFunction() {
        cartPanel.style.animation = 'SlideOut 0.3s ease forwards';

        cartPanel.addEventListener('animationend', () => {
            cartContainer.remove();
        }, { once: true });
    }

    const cartBody = document.getElementById('cart-body');
    cartItems.forEach((product) => {
        if (product.quantity === 0) return;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item')
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

        cartItem.onclick = (e) => {
            e.stopPropagation();

            product.quantity = 0;
            cartItem.remove();

            updateTotalPrice();
        }

        const minusBtn = cartItem.querySelectorAll(".qty-btn")[0];
        const plusBtn = cartItem.querySelectorAll(".qty-btn")[1];
        const quantityText = cartItem.querySelector(".quantity");

        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            product.quantity++;
            quantityText.textContent = product.quantity;
            updateTotalPrice();
        });

        minusBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            if (product.quantity > 1) {
                product.quantity--;
                quantityText.textContent = product.quantity;
                updateTotalPrice();
            }
        });

    });

    closeBtn.onclick = closeCartFunction;

    updateTotalPrice();
    cartOverlay.onclick = (e) => {
        if (e.target === cartOverlay) {
            closeCartFunction();
        }
    };

    checkoutBtn.onclick = async () => {
        const overlayContainer = document.getElementById('overlay-container');
        await updateContent('html/checkout.html', overlayContainer);
        
        overlayContainer.style.visibility = 'visible';
        document.body.style.overflowY = 'hidden';
        checkOutScript();
        closeCartFunction();
    }
}

export function getCardData() {
    fetch('/get-user-cart')
        .then(res => res.json())
        .then(data => {
                if (data.length === 0 ) return;

                console.log(data);
                // cartItems = data;
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

    console.log(userCart);
    
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userCart)
    }

    fetch('/save-user-cart', options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
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
    return cartItems.filter(item => item.quantity !== 0).length;
}

export function updateCartItemCount() {
    const cartItemCount = document.getElementById('cart-item-count');

    if (cartItems.length === 0) {
        cartItemCount.style.visibility = 'hidden';
        return;
    };

    cartItemCount.style.visibility = 'visible';
    cartItemCount.innerHTML = cartItems.length;
}

export function clearCart() {
    cartItems.length = 0;
}