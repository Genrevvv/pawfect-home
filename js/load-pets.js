import { cardAnimation } from "./animations.js";

// Loads products on products section on index.html
export function loadPets() {
    const productsContainer = document.getElementById('products-container');

    fetch('/get-pets')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            console.log(productsContainer);

            for (let i = 0; i < data['pets'].length; i++) {
                const pet = data['pets'][i];

                const petData = document.createElement('div');
                petData.classList.add('pet-data', pet['pet_type'], 'card');
                petData.innerHTML = `<div class="pet-image">
                                            <img src="${pet.image}">
                                        </div>
                                        <div class="details-container">
                                            <div class="container-1">
                                                <span class="pet-name">${pet['pet_name']}</span>
                                                <span class="pet-description">${pet['pet_description']}</span>
                                            </div>
                                            <div class="container-2">
                                                <span class="pet-age">${pet['pet_age']}</span>
                                            </div>
                                        </div>`;
            
                productsContainer.append(petData);
                setupNavFilter();
            }

            cardAnimation();
    });

    function setupNavFilter() {
        const allBtn = document.getElementById('all-btn');
        const catBtn = document.getElementById('cats-btn');
        const dogBtn = document.getElementById('dogs-btn');

        const filters = [allBtn, catBtn, dogBtn];

        const pets = productsContainer.querySelectorAll('.pet-data');
        allBtn.onclick = () => {
            pets.forEach(pet => {
                pet.style.display = '';
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
            pets.forEach(pet => {
                pet.style.display = pet.classList.contains('cat') ? '' : 'none';
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
            pets.forEach(pet => {
                pet.style.display = pet.classList.contains('dog') ? '' : 'none';
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