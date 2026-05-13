import { displayMessage } from "./auxiliary.js";

export function productManagementScript() {
    const productName = document.getElementById('product-name');
    const category = document.getElementById('category');
    const price = document.getElementById('price');
    const stock = document.getElementById('stock');
    const uploadImageArea = document.getElementById('upload-image-area');
    const addProduct = document.getElementById('add-product');
    let imageFile = null;

    uploadImageArea.onclick = () => {
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
                    displayImage(imageData);
                }

                fileReader.readAsDataURL(imageFile);
            }
            input.click();
    }

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

                if (data['error'] === null) {
                    console.log('dwadwdadadw');
                    displayMessage(data['error']);
                    return;
                }

                displayMessage('Product was added successfully');
                addProductElement(data['product_data']);
            });
    }

    function addProductElement(productData) {
        console.log('add prod element');

        const status = productData['quantity'] > 0 ? 'In Stock' : 'No Stock';

        const productLog = document.getElementById('product-log');
        const newProductRow = document.createElement('tr');
        newProductRow.innerHTML = `<td>${productData['product_name']}</td>
                                    <td>₱${productData['price']}</td>
                                    <td>${productData['quantity']}</td>
                                    <td>${status}</td>
                                    <td>
                                        <i class="fa-regular fa-pen-to-square"></i>
                                        <i class="fa-solid fa-trash"></i>
                                    </td>`;

        productLog.append(newProductRow);
    }

    function displayImage(imageData) {
        const innerSpan = uploadImageArea.getElementsByTagName('span')[0];

        // Display image on upload image area
        uploadImageArea.style.backgroundImage = `url('${imageData}')`;
        uploadImageArea.style.borderStyle = 'solid';
        innerSpan.style.visibility = 'hidden';
        
        const removeImage = document.getElementById('remove-image');
        removeImage.classList.add('holds-image');

        removeImage.onclick = (e) => {
            e.stopPropagation();
            
            removeImage.classList.remove('holds-image');

            // Reset upload image area
            uploadImageArea.style.backgroundImage = 'none';
            uploadImageArea.style.borderStyle = 'dashed';
            innerSpan.style.visibility = 'visible';
        }
    }
}
