import { petContentPreview } from "./content-preview.js";

export function featuredScript() {
    const featured = document.getElementById('featured');
    const featuredDogs = document.getElementById('featured-dogs');
    const featuredCats = document.getElementById('featured-cats');
    const featuredProducts = document.getElementById('featured-products');

    fetch('/get-featured')
        .then(res => res.json())
        .then(data => {
            if (!data) return;

            data.featured_dogs.forEach(pet => addFeaturedPets(pet, featuredDogs));
            data.featured_cats.forEach(pet => addFeaturedPets(pet, featuredCats));
            data.featured_products.forEach(product => addFeaturedProducts(product, featuredProducts));
        });

    function addFeaturedPets(petData, featuredContainer) {
        console.log(petData);
        const innerContainer = featuredContainer.querySelector('.inner-container');

        const newPetCard = document.createElement('div');
        newPetCard.classList.add('featured-element');

        newPetCard.innerHTML = `
            <img src="${petData['image']}" alt="">
            <div class="details">
                <span class="pet-name">${petData['pet_name']}</span>
                <span class="pet-description">${petData['pet_description']}</span>
                <i class="fa-solid fa-mars pet-gender"></i>
            </div>
            <i class="fa-regular fa-heart"></i>
        `;

        innerContainer.append(newPetCard);

        newPetCard.onclick = () => {
            petContentPreview(petData);
        }
    }    

    function addFeaturedProducts(productData, featuredContainer) {
        console.log(productData);
        const innerContainer = featuredContainer.querySelector('.inner-container');

        const newProductCard = document.createElement('div');
        newProductCard.classList.add('featured-element');

        newProductCard.innerHTML = `
            <img src="${productData['image']}" alt="">
            <div class="details">
                <span class="pet-name">${productData['product_name']}</span>
                <span class="pet-description">${productData['description']}</span>
            </div>
            <i class="fa-regular fa-heart"></i>
        `;

        innerContainer.append(newProductCard);
    }    
}
