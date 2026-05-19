
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
                                        </div>`;
            
                productsContainer.append(petCard);

                petCard.onclick = () => {
                    petContentPreview(petData);
                }
            }

            setupNavFilter();

            const pets = productsContainer.querySelectorAll('.card');
            pets.forEach(pet => {
                if (petFilter === "all") {
                    pet.style.display = "";
                }
                else {
                    pet.style.display = pet.classList.contains(petFilter)
                        ? ""
                        : "none";
                }
            });

            syncFilterHighlight(); 
            cardAnimation();
    });

    function setupNavFilter() {
        const allBtn = document.getElementById('all-btn');
        const catBtn = document.getElementById('cats-btn');
        const dogBtn = document.getElementById('dogs-btn');

        const filters = [allBtn, catBtn, dogBtn];

        const pets = productsContainer.querySelectorAll('.card');
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

    function syncFilterHighlight() {
        const allBtn = document.getElementById('all-btn');
        const catBtn = document.getElementById('cats-btn');
        const dogBtn = document.getElementById('dogs-btn');

        const filters = [allBtn, catBtn, dogBtn];

        filters.forEach(btn => btn.classList.remove('highlighted'));

        if (petFilter === "dog") dogBtn?.classList.add("highlighted");
        else if (petFilter === "cat") catBtn?.classList.add("highlighted");
        else allBtn?.classList.add("highlighted");
    }
}