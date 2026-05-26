
import { cardAnimation } from "./animations.js";
import { truncateString } from "./auxiliary.js";
import { petContentPreview } from "./pet-preview.js";
import { petFilter } from "./state.js";

// Loads products on products section on index.html
export function loadPets() {
    const productsContainer = document.getElementById('products-container');

    fetch('/get-pets')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            console.log(productsContainer);

            for (let i = 0; i < data['pets'].length; i++) {
                const petData = data['pets'][i];

                let petSexIcon = '';
                if (petData['pet_sex'].toLowerCase() === 'male') {
                    petSexIcon = '<i class="fa-solid fa-mars pet-gender"></i>';
                }
                else if (petData['pet_sex'].toLowerCase() === 'female') {
                    petSexIcon = '<i class="fa-solid fa-venus pet-gender"></i>';
                }
                
                const petCard = document.createElement('div');
                petCard.classList.add(petData['pet_type'], 'card');
                petCard.innerHTML = `<div class="pet-image">
                                            <img src="${petData.image}">
                                        </div>
                                        <div class="details-container">
                                            <div class="container-1">
                                                <span class="pet-name">${petData['pet_name']}</span>
                                                <span class="pet-description">
                                                    ${truncateString(petData['pet_description'], 60)}
                                                </span>
                                            </div>
                                            <div class="container-2">
                                                <span class="pet-age">${petData['pet_age']}</span>
                                            </div>
                                            ${petSexIcon}
                                        </div>`;
            
                productsContainer.append(petCard);

                petCard.onclick = () => {
                    petContentPreview(petData);
                }
            }

            setupNavFilter();
            cardAnimation();
    });

    function setupNavFilter() {
        const allBtn = document.getElementById('all-btn');
        const catBtn = document.getElementById('cats-btn');
        const dogBtn = document.getElementById('dogs-btn');

        const filters = [allBtn, catBtn, dogBtn];

        const products = productsContainer.querySelectorAll('.card');

        allBtn.onclick = () => {
            products.forEach(p => p.style.display = '');
            filters.forEach(f => f.classList.toggle('highlighted', f.id === 'all-btn'));
        };

        catBtn.onclick = () => {
            products.forEach(p => p.style.display = p.classList.contains('cat') ? '' : 'none');
            filters.forEach(f => f.classList.toggle('highlighted', f.id === 'cats-btn'));
        };

        dogBtn.onclick = () => {
            products.forEach(p => p.style.display = p.classList.contains('dog') ? '' : 'none');
            filters.forEach(f => f.classList.toggle('highlighted', f.id === 'dogs-btn'));
        };
    }
}