import { cardAnimation } from "./animations.js";
import { truncateString, updateContent } from "./auxiliary.js";
import { addToCart } from "./cart.js";
import { petContentPreview } from "./pet-preview.js";
import { productContentPreview } from "./product-preview.js";

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const content = document.getElementById('content');

let allData = null;

fetch('/fetch-all-data')
    .then(res => res.json())
    .then(data => {
        allData = data;
    });

searchBtn.onclick = searchScript;
searchInput.onkeydown = (e) => {
    if (e.key === "Enter") {
        searchScript();
    }
}

async function searchScript() {
    if (!allData) return;

    await updateContent('html/search-content.html', content);
    await new Promise(requestAnimationFrame);

    const resultsContainer = document.getElementById('results-container');

    const petCards = document.getElementById('pet-cards');
    const productCards = document.getElementById('product-cards');

    const query = searchInput.value.toLowerCase();
    allData.pets.forEach(pet => {
        if (!pet.pet_name.toLowerCase().includes(query)) {
            return;
        }

        const span = petCards.querySelector('span');
        if (span) {
            span.remove();
        }

        createPetCard(pet, petCards);
    });

    allData.products.forEach(product => {
        if (!product.product_name.toLowerCase().includes(query)) {
            return;
        }

        const span = productCards.querySelector('span');
        if (span) {
            span.remove();
        }

        createProductCard(product, productCards);
    });

    cardAnimation();
}

function createPetCard(petData, parentContainer) {
    const petCard = document.createElement('div');
    petCard.classList.add(petData.pet_type, 'card');

    petCard.innerHTML = `
        <div class="pet-image">
            <img src="${petData.image}">
        </div>
        <div class="details-container">
            <div class="container-1">
                <span class="pet-name">${petData.pet_name}</span>
                <span class="pet-description">
                    ${truncateString(petData.pet_description, 60)}
                </span>
            </div>
            <div class="container-2">
                <span class="pet-age">${petData.pet_age}</span>
            </div>
        </div>
    `;

    petCard.onclick = () => {
        petContentPreview(petData);
    };

    parentContainer.appendChild(petCard);
}

function createProductCard(productData, parentContainer) {
    const productCard = document.createElement('div');
    productCard.classList.add(productData.pet_type, 'card');

    productCard.innerHTML = `
        <div class="product-image">
            <img src="${productData.image}">
        </div>

        <div class="details-container">
            <div class="container-1">
                <span class="product-name">${productData.product_name}</span>
                <span class="product-description">${productData.description}</span>
            </div>

            <div class="container-2">
                <span class="price">₱${productData.price}</span>
                <div class="add-to-cart">Add to Cart</div>
            </div>
        </div>
    `;

    const addToCartBtn = productCard.querySelector('.add-to-cart');

    addToCartBtn.onclick = (e) => {
        e.stopPropagation();
        addToCart(productData);
    };

    productCard.onclick = () => {
        productContentPreview(productData);
    };

    parentContainer.appendChild(productCard);
}
