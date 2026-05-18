import { truncateString, updateContent } from "./auxiliary.js";
import { petContentPreview } from "./content-preview.js";
import { loadProducts } from "./load-products.js";
import { setPetFilter } from "./state.js";

export function featuredScript() {
    const featured = document.getElementById('featured');
    const featuredDogs = document.getElementById('featured-dogs');
    const featuredCats = document.getElementById('featured-cats');
    const featuredProducts = document.getElementById('featured-products');

    const adoptPet = document.getElementById('adopt-pet');
    const petGadgets = document.getElementById('pet-gadgets');

    const viewAllDogs = document.getElementById('view-all-dogs');
    const viewAllCats = document.getElementById('view-all-cats');
    const viewAllProducts = document.getElementById('view-all-products');

    viewAllDogs.onclick = () => {
        setPetFilter("dog");
        adoptPet.click();
    };

    viewAllCats.onclick = () => {
        setPetFilter("cat");
        adoptPet.click();
    };

    viewAllProducts.onclick = async () => {
        const content = document.getElementById('content');
        await updateContent('html/all-products.html', content);
        loadProducts(null);
    }

    fetch('/get-featured')
        .then(res => res.json())
        .then(data => {
            if (!data) return;

            data.featured_dogs.forEach(pet => addFeaturedPets(pet, featuredDogs));
            data.featured_cats.forEach(pet => addFeaturedPets(pet, featuredCats));
            data.featured_products.forEach(product => addFeaturedProducts(product, featuredProducts));
        });

    function addFeaturedPets(petData, featuredContainer) {
        const innerContainer = featuredContainer.querySelector('.inner-container');

        const newPetCard = document.createElement('div');
        newPetCard.classList.add('featured-element');

        let petSexIcon = '';
        if (petData['pet_sex'] === 'male') {
            petSexIcon = '<i class="fa-solid fa-mars pet-gender"></i>';
        }
        else if (petData['pet_sex'] === 'female') {
            petSexIcon = '<i class="fa-solid fa-venus pet-gender"></i>';
        }

        newPetCard.innerHTML = `
            <img src="${petData['image']}" alt="">
            <div class="details">
                <span class="pet-name">${petData['pet_name']}</span>
                <span class="pet-description">${truncateString(petData['pet_description'], 30)}</span>
                ${petSexIcon}
            </div>
            <i class="fa-regular fa-heart"></i>
        `;

        innerContainer.append(newPetCard);

        newPetCard.onclick = () => {    
            petContentPreview(petData);
        }
    }    

    function addFeaturedProducts(productData, featuredContainer) {
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
