import { displayMessage, formatNumber } from "./auxiliary.js";
import { clearCart, updateCartItemCount, updateTotalPrice } from "./cart.js";
import { cartItems } from "./init.js";

export function checkOutScript() {
    const paymentMethod = document.getElementById('payment-method');
    const gcashInput = document.getElementById('gcash-input');
    const mayaInput = document.getElementById('maya-input');
    const cardInputs = document.getElementById('card-inputs');
    const checkoutProducts = document.getElementById('checkout-products');
    const placeOrderBtn = document.getElementById('place-order-btn');

    cartItems.forEach(item => {
        if (item.quantity === 0) return;

        const checkoutItem = document.createElement('div');
        checkoutItem.classList.add('checkout-item');
        checkoutItem.innerHTML = `
            <img src="${item.image}" class="checkout-img">
            <div class="checkout-details">
                <h3>${item.product_name}</h3>
                <span>Quantity: ${item.quantity}</span>
            </div>
            <div class="checkout-price">₱${formatNumber(item.price * item.quantity)}</div>
        `;

        checkoutProducts.append(checkoutItem);
    });

    updatePaymentInputs();
    const total = updateTotalPrice();

    paymentMethod.onchange = updatePaymentInputs

    placeOrderBtn.onclick = () => {
        if (sessionStorage.getItem('username') === null) {
            logIn();
            return;
        }

        const paymentInputs = Array.from(document.querySelectorAll('.payment-id'))
            .map(input => input.value.trim())
            .filter(value => value !== '');

        console.log(paymentInputs);

        const orderData = {
            cart: cartItems,
            name: document.getElementById('name')?.value || '',
            address: document.getElementById('address')?.value || '',
            payment_method: document.getElementById('payment-method')?.value || '',
            payment_id: paymentInputs[0] ?? null,
            total_price: total
        };

        if (orderData.name === '' || orderData.address === '') {
            displayMessage('Please fill up all fields');
            return;
        }

        if (orderData.payment_method !== 'cod' && orderData.payment_id === null) {
            displayMessage('Please input a account ID/Number');
            return;
        }

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        }

        console.log(orderData);

        fetch('/place-order', options)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (!data['success']) {
                    displayMessage(data['error'], 4000);
                    return;
                }

                displayMessage('Order was placed successfully');

                clearCart();
                updateCartItemCount();

                const overlayContainer = document.getElementById('overlay-container');
                overlayContainer.click();
            })
    };
    
    function updatePaymentInputs() {
        gcashInput.style.display = 'none';
        mayaInput.style.display = 'none';
        cardInputs.style.display = 'none';
        if (paymentMethod.value === 'gcash') {
            gcashInput.style.display = 'block';
        }
        else if (paymentMethod.value === 'maya') {
            mayaInput.style.display = 'block';
        }
        else if (paymentMethod.value === 'card') {
            cardInputs.style.display = 'flex';
        }
    }
}

