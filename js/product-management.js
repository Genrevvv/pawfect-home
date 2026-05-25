import { displayMessage } from "./auxiliary.js";

export function productManagementScript() {
    const overlayContainer = document.getElementById('overlay-container');

    const productName = document.getElementById('product-name');
    const description = document.getElementById('description');
    const category = document.getElementById('category');
    const petType = document.getElementById('pet-type');
    const price = document.getElementById('price');
    const stock = document.getElementById('stock');
    const uploadImageArea = document.getElementById('upload-image-area');
    const addProduct = document.getElementById('add-product');

    let imageFile = null;

    loadProducts();

    uploadImageArea.onclick = () => {
        uploadImage(uploadImageArea);
    };

    addProduct.onclick = () => {
        const productData = new FormData();
        productData.append('product_name', productName.value);
        productData.append('description', description.value);
        productData.append('category', category.value);
        productData.append('pet_type', petType.value);
        productData.append('price', price.value);
        productData.append('stock', stock.value);
        productData.append('image', imageFile);

        fetch('/add-product', {
            method: 'POST',
            body: productData
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) return displayMessage(data.error);

            displayMessage('Product was added successfully');
            addProductElement(data.product_data);

            // Clear add product form
            productName.value = '';
            description.value = '';
            category.value = '';
            petType.value = '';
            price.value = '';
            stock.value = '';

            imageFile = null;

            uploadImageArea.style.backgroundImage = 'none';
            uploadImageArea.style.borderStyle = 'dashed';

            uploadImageArea.querySelector('span').style.visibility = 'visible';

            const remove = uploadImageArea.querySelector('.remove-image');
            remove.classList.remove('holds-image');
        });
    };

    function loadProducts() {
        fetch('/get-products')
            .then(res => res.json())
            .then(data => {
                if (!data.products) return;

                data.products.forEach(p => addProductElement(p));
            });
    }

    function addProductElement(productData) {

        const productLog = document.getElementById('product-log');

        const newProductRow = document.createElement('tr');
        newProductRow.innerHTML = `
            <td class="product_name">${productData.product_name}</td>
            <td class="price">₱${productData.price}</td>
            <td class="stock">${productData.stock}</td>
            <td class="status">${productData.stock > 0 ? 'In Stock' : 'No Stock'}</td>
            <td>
                <i id="edit-product-${productData.id}" class="fa-regular fa-pen-to-square"></i>
                <i id="delete-product-${productData.id}" class="fa-solid fa-trash"></i>
            </td>
        `;

        productLog.append(newProductRow);

        const editButton = document.getElementById(`edit-product-${productData.id}`);

        editButton.onclick = () => {
            fetch('html/edit-product.html')
                .then(res => res.text())
                .then(html => {
                    overlayContainer.innerHTML = html;
                    overlayContainer.style.visibility = 'visible';
                    document.body.style.overflowY = 'hidden';

                    const editProductName = document.getElementById('edit-product-name');
                    const editDescription = document.getElementById('edit-description');
                    const editCategory = document.getElementById('edit-category');
                    const editPetType = document.getElementById('edit-pet-type');
                    const editPrice = document.getElementById('edit-price');
                    const editStock = document.getElementById('edit-stock');
                    const updateProduct = document.getElementById('update-product');
                    const editUploadedImageArea = document.getElementById('edit-uploaded-image-area');

                    editProductName.value = productData.product_name;
                    editDescription.value = productData.description;
                    editCategory.value = productData.category;
                    editPetType.value = productData.pet_type;
                    editPrice.value = productData.price;
                    editStock.value = productData.stock;
                    displayImage(productData.image, editUploadedImageArea);

                    updateProduct.onclick = () => {
                        const updatedProductData = {
                            product_id: productData.id,
                            product_name: editProductName.value,
                            description: editDescription.value,
                            category: editCategory.value,
                            pet_type: editPetType.value,
                            price: editPrice.value,
                            stock: editStock.value,
                            image: imageFile || productData.image
                        };

                        updateProductData(updatedProductData, productData, newProductRow);
                    };
                });
        };

        const deleteButton = document.getElementById(`delete-product-${productData.id}`);

        deleteButton.onclick = () => {
            fetch('/delete-product', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ product_id: productData.id })
            })
            .then(res => res.json())
            .then(() => {
                newProductRow.remove();
                displayMessage(`${productData.product_name} deleted successfully`);
            });
        };
    }

    function updateProductData(updatedProductData, productData, productRow) {

        const fd = new FormData();

        Object.entries(updatedProductData).forEach(([k, v]) => {
            fd.append(k, v);
        });

        fetch('/update-product', {
            method: 'POST',
            body: fd
        })
        .then(res => res.json())
        .then(data => {

            if (data.error) return displayMessage(data.error);

            displayMessage('Product was updated successfully');

            overlayContainer.innerHTML = '';
            overlayContainer.style.visibility = 'hidden';
            document.body.style.overflowY = 'visible';

            productRow.querySelector('.product_name').innerText = updatedProductData.product_name;
            productRow.querySelector('.price').innerText = `₱${updatedProductData.price}`;
            productRow.querySelector('.stock').innerText = updatedProductData.stock;
            productRow.querySelector('.status').innerText =
                updatedProductData.stock > 0 ? 'In Stock' : 'No Stock';

            Object.assign(productData, updatedProductData);
        });
    }

    function uploadImage(formDiv) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e) => {
            imageFile = e.target.files[0];
            if (!imageFile) return;

            const reader = new FileReader();
            reader.onload = () => {
                displayImage(reader.result, formDiv);
            };
            reader.readAsDataURL(imageFile);
        };

        input.click();
    }

    function displayImage(imageData, formDiv) {
        const span = formDiv.querySelector('span');

        formDiv.style.backgroundImage = `url('${imageData}')`;
        formDiv.style.borderStyle = 'solid';
        span.style.visibility = 'hidden';

        const remove = formDiv.querySelector('.remove-image');
        remove.classList.add('holds-image');

        remove.onclick = (e) => {
            e.stopPropagation();

            remove.classList.remove('holds-image');
            formDiv.style.backgroundImage = 'none';
            formDiv.style.borderStyle = 'dashed';
            span.style.visibility = 'visible';

            imageFile = null;
        };

        formDiv.onclick = () => uploadImage(formDiv);
    }
}
