import { updateContent, displayMessage, toTitleCase } from "./auxiliary.js";
import { addToCart } from "./cart.js";
import { logIn } from "./header-bar.js";

export async function productContentPreview(productData) {

    const overlayContainer = document.getElementById('overlay-container');

    if (!overlayContainer) {
        console.error("overlay-container missing");
        return;
    }

    await updateContent('html/product-preview.html', overlayContainer);

    overlayContainer.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';

    document.getElementById('product-image').src = productData.image;
    document.getElementById('product-name').innerText = productData.product_name;
    document.getElementById('price').innerText = `₱${productData.price}`;
    document.getElementById('stock').innerText = productData.stock;
    document.getElementById('category').innerText = toTitleCase(productData.category.replace('_', ' '));
    document.getElementById('description').innerText = productData.description;
    

    const closeBtn = document.getElementById('close-btn');
    closeBtn.onclick = closeProductPreview;

    document.getElementById('add-cart').onclick = () => {
        if (sessionStorage.getItem('username') === null) {
            logIn();
            return;
        }

        addToCart(productData);
        closeProductPreview();
    };

    function closeProductPreview() {
        overlayContainer.style.visibility = 'hidden';
        overlayContainer.innerHTML = '';
        document.body.style.overflowY = 'visible';
    }
}

