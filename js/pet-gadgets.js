export function petGadgetsScript() {
    const options = {
        method: 'POST',
        headers:  { 'Content-Type': 'application/json' },
        body: JSON.stringify({category: 'pet_houses'})
    };

    fetch('/get-products', options)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            const productsContainer = document.getElementById('products-container');
            console.log(productsContainer);

            for (let i = 0; i < data['products'].length; i++) {
                const product = data['products'][i];

                const productData = document.createElement('div');
                productData.classList.add('product-data');
                productData.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}">
                    </div>
                    <div class="details-container">
                        <div class="container-1">
                            <span class="product-name">${product['product_name']}</span>
                            <span class="product-description">Cool Shi, bruh :)</span>
                        </div>
                        <div class="container-2">
                            <span class="price">₱${product['price']}</span>
                            <div class="add-to-cart">Add to Cart</div>
                        </div>
                    </div>`;
            
                productsContainer.append(productData);
            }
        });
}
