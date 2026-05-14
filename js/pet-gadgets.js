export function petGadgetsScript() {
    const productsContainer = document.getElementById('products-container');

    const options = {
        method: 'POST',
        headers:  { 'Content-Type': 'application/json' },
        body: JSON.stringify({category: 'pet_gadgets'})
    };

    fetch('/get-products', options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            console.log(productsContainer);

            for (let i = 0; i < data['products'].length; i++) {
                const product = data['products'][i];

                const productData = document.createElement('div');
                productData.classList.add('product-data', product['pet_type']);
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
                setupNavFilter();
            }
        });

    function setupNavFilter() {
        const allBtn = document.getElementById('all-btn');
        const catBtn = document.getElementById('cats-btn');
        const dogBtn = document.getElementById('dogs-btn');

        const filters = [allBtn, catBtn, dogBtn];

        const products = productsContainer.querySelectorAll('.product-data');
        allBtn.onclick = () => {
            products.forEach(product => {
                product.style.display = '';
            });

            filters.forEach(filter => {
                if (filter.id === 'all-btn') {
                    filter.classList.add('highlighted');
                }
                else {
                    filter.classList.remove('highlighted');
                }
            });
        }

        catBtn.onclick = () => {
            products.forEach(product => {
                product.style.display = product.classList.contains('cat') ? '' : 'none';
            });

            filters.forEach(filter => {
                if (filter.id === 'cats-btn') {
                    filter.classList.add('highlighted');
                }
                else {
                    filter.classList.remove('highlighted');
                }
            });
        }

        dogBtn.onclick = () => {
            products.forEach(product => {
                product.style.display = product.classList.contains('dog') ? '' : 'none';
            });

            filters.forEach(filter => {
                if (filter.id === 'dogs-btn') {
                        filter.classList.add('highlighted');
                }
                else {
                    filter.classList.remove('highlighted');
                }
            });
        }
    }
}
