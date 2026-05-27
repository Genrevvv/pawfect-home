import { cardAnimation } from "./animations.js";
import { displayMessage, truncateString } from "./auxiliary.js";
import { addToCart } from "./cart.js";
import { logIn } from "./header-bar.js";
import { productContentPreview } from "./product-preview.js";

export function loadProducts(category) {
    const productsContainer = document.getElementById('products-container');

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: category })
    };

    fetch('/get-products', options)
        .then(res => res.json())
        .then(data => {

            productsContainer.innerHTML = '';

            const products = data.products;

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add(product.pet_type, 'card');

                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}">
                    </div>

                    <div class="details-container">
                        <div class="container-1">
                            <span class="product-name">${truncateString(product.product_name, 25)}</span>
                            <span class="product-description">${truncateString(product.description, 40)}</span>
                        </div>

                        <div class="container-2">
                            <span class="price">₱${product.price}</span>
                            <div class="add-to-cart">Add to Cart</div>
                        </div>
                    </div>
                `;

                productsContainer.appendChild(productCard);

                productCard.onclick = (e) => {
                    e.stopPropagation();
                    
                    productContentPreview(product);
                };

                const addToCartBtn = productCard.querySelector('.add-to-cart');
                addToCartBtn.onclick = (e) => {
                    if (sessionStorage.getItem('username') === null) {
                        logIn();
                        return;
                    }

                    e.stopPropagation();
                    addToCart(product);
                };

            });

            setupNavFilter();
            cardAnimation();
        });

    function setupNavFilter() {
        const allBtn = document.getElementById('all-btn');
        const catBtn = document.getElementById('cats-btn');
        const dogBtn = document.getElementById('dogs-btn');

        const filters = [allBtn, catBtn, dogBtn];

        const products = productsContainer.querySelectorAll('.card');

        allBtn.onclick = () => {
            products.forEach(p => p.style.display = '');
            filters.forEach(f => f.classList.toggle('highlighted', f.id === 'all-btn'));
        };

        catBtn.onclick = () => {
            products.forEach(p => p.style.display = p.classList.contains('cat') || 
                                                    p.classList.contains('both') ? '' : 'none');
            filters.forEach(f => f.classList.toggle('highlighted', f.id === 'cats-btn'));
        };

        dogBtn.onclick = () => {
            products.forEach(p => p.style.display = p.classList.contains('dog') || 
                                                    p.classList.contains('both') ? '' : 'none');
            filters.forEach(f => f.classList.toggle('highlighted', f.id === 'dogs-btn'));
        };
    }
}

