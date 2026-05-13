import { displayMessage } from "./auxiliary.js";

export function productManagementScript() {
    const overlayContainer = document.getElementById('overlay-container');

    const productName = document.getElementById('product-name');
    const category = document.getElementById('category');
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
        productData.append('category', category.value);
        productData.append('price', price.value);
        productData.append('stock', stock.value);
        productData.append('image', imageFile);       

        const options = {
            method: 'POST',
            body: productData
        }
        
        fetch('/add-product', options)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data['error'] != null) {
                    displayMessage(data['error']);
                    return;
                }

                displayMessage('Product was added successfully');
                addProductElement(data['product_data']);
            });
    }

    function loadProducts() {
        fetch('/get-products')
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data['products'] === null) {
                    console.log('hell nah');
                    return;
                }

                for (let i = 0; i < data['products'].length; i++) {
                    addProductElement(data['products'][i]);
                }
            });
    }

    function addProductElement(productData) {
        console.log('add prod element');

        const status = productData['stock'] > 0 ? 'In Stock' : 'No Stock';
        const editProductId = `edit-product-${productData['id']}`;
        const deleteProductId = `delete-product-${productData['id']}`;

        const productLog = document.getElementById('product-log');
        const newProductRow = document.createElement('tr');
        newProductRow.innerHTML = `<td class="product_name">${productData['product_name']}</td>
                                    <td class="price">₱${productData['price']}</td>
                                    <td class="stock">${productData['stock']}</td>
                                    <td class="status">${status}</td>
                                    <td>
                                        <i id="${editProductId}" class="fa-regular fa-pen-to-square"></i>
                                        <i id="${deleteProductId}" class="fa-solid fa-trash"></i>
                                    </td>`;

        productLog.append(newProductRow);
        
        const editButton = document.getElementById(editProductId);
        editButton.onclick = () => {
            fetch('html/edit-product.html')
                .then(res => res.text())
                .then(html => {
                    overlayContainer.innerHTML = html;
                    overlayContainer.style.visibility = 'visible';
                    document.body.style.overflowY = 'hidden';
                    
                    const editProductName = document.getElementById('edit-product-name');
                    const editCategory = document.getElementById('edit-category');
                    const editPrice = document.getElementById('edit-price');
                    const editStock = document. getElementById('edit-stock');
                    const editUploadedImageArea = document.getElementById('edit-uploaded-image-area');
                    const updateProduct = document.getElementById('update-product');

                    editProductName.value = productData['product_name'];
                    editCategory.value = productData['category'];
                    editPrice.value = productData['price'];
                    editStock.value = productData['stock'];
                    displayImage(productData['image'], editUploadedImageArea);

                    updateProduct.onclick = () => {
                        updateProductData({
                            product_id: productData['id'],
                            product_name: editProductName.value,
                            category: editCategory.value,
                            price: editPrice.value,
                            stock: editStock.value,
                            image: imageFile || productData['image']
                        }, newProductRow);
                    }
                });
        }

        const deleteButton = document.getElementById(deleteProductId);
        deleteButton.onclick = () => {
            const options = {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({product_id: productData['id']})
            };

            fetch('/delete-product', options)
                .then(res => res.json())
                .then(data => {
                    newProductRow.remove();
                    displayMessage(`${productData['product_name']} deleted successfully`);
                });
        }

    }

    function updateProductData(updatedProductData, productRow) {
        const updatedData = new FormData();
        updatedData.append('product_id', updatedProductData['product_id']);
        updatedData.append('product_name', updatedProductData['product_name']);
        updatedData.append('category', updatedProductData['category']);
        updatedData.append('price', updatedProductData['price']);
        updatedData.append('stock', updatedProductData['stock']);
        updatedData.append('image', updatedProductData['image']);     

        for (const [key, value] of updatedData.entries()) {
            console.log(key, value);
        }

        const options = {
            method: 'POST',
            body: updatedData
        }

        fetch('/update-product', options)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data['error'] != null) {
                    displayMessage(data['error']);
                    return;
                }
                
                displayMessage('Product was updated successfully');

                overlayContainer.innerHTML = '';
                overlayContainer.style.visibility = 'hidden';
                document.body.style.overflowY = 'visible';

                productRow.querySelector('.product_name').innerText = updatedProductData['product_name'];
                productRow.querySelector('.price').innerText = `₱${updatedProductData['price']}`;
                productRow.querySelector('.stock').innerText = updatedProductData['stock'];
                productRow.querySelector('.status').innerText = updatedProductData['stock'] > 0 ? 'In Stock' : 'No Stock';
            });
    }

    function uploadImage(formDiv) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                imageFile = e.target.files[0];

                // I don't think this will even happen tho, lol
                // Code: based from SocialMD's, lol
                    // https://github.com/Genrevvv/SocialMD/blob/main/js/create-post.js

                // Miss na kita

                if (!imageFile) {
                    return;
                }

                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const imageData = fileReader.result;
                    displayImage(imageData, formDiv);
                }

                fileReader.readAsDataURL(imageFile);
            }
            input.click();
    }

    function displayImage(imageData, formDiv) {
        const innerSpan = formDiv.getElementsByTagName('span')[0];

        // Display image on upload image area
        formDiv.style.backgroundImage = `url('${imageData}')`;
        formDiv.style.borderStyle = 'solid';
        innerSpan.style.visibility = 'hidden';
        
        const removeImage = formDiv.querySelector('.remove-image');
        removeImage.classList.add('holds-image');

        removeImage.onclick = (e) => {
            e.stopPropagation();
            
            removeImage.classList.remove('holds-image');

            // Reset upload image area
            formDiv.style.backgroundImage = 'none';
            formDiv.style.borderStyle = 'dashed';
            innerSpan.style.visibility = 'visible';
        }

        formDiv.onclick = () => {
            uploadImage(formDiv);
        };
    }
}
