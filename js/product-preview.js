import { updateContent, displayMessage } from "./auxiliary.js";

export async function productContentPreview(productData) {

    const overlayContainer = document.getElementById('overlay-container');

    if (!overlayContainer) {
        console.error("overlay-container missing");
        return;
    }

    overlayContainer.innerHTML = "";
    await updateContent('html/product-preview.html', overlayContainer);

    overlayContainer.style.display = "flex";
    overlayContainer.style.visibility = "visible";

    document.body.style.overflow = "hidden";

    document.getElementById('product-image').src = productData.image;
    document.getElementById('product-name').innerText = productData.product_name;
    document.getElementById('price').innerText = `₱${productData.price}`;
    document.getElementById('stock').innerText = productData.stock;
    document.getElementById('category').innerText = productData.category;
    document.getElementById('description').innerText = productData.description;

    document.getElementById('close-btn').onclick = () => {
        overlayContainer.style.visibility = "hidden";
        document.body.style.overflowY = "visible";
    };

    document.getElementById('add-cart').onclick = () => {

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existing = cart.find(p => p.id == productData.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...productData, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        displayMessage("Added to cart");
    };
}

