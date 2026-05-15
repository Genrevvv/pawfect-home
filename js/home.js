import { navBarAnimations } from "./animations.js";
import { loadProducts } from "./load-products.js";

window.history.pushState(null, "", "/");

const content = document.getElementById('content');

const adoptPet = document.getElementById('adopt-pet');
const petHouses = document.getElementById('pet-houses');
const petGadgets = document.getElementById('pet-gadgets');
const petFoods = document.getElementById('pet-foods');

navBarAnimations();
updateContent('html/home-page.html');

adoptPet.onclick = async () => {
    highlightOption('adopt-pet');
    updateContent('html/adopt-pet.html');
}

petHouses.onclick = async () => {
    highlightOption('pet-houses');
    await updateContent('html/pet-houses.html');
    loadProducts('pet_houses');
}

petGadgets.onclick = async () => {
    highlightOption('pet-gadgets');
    await updateContent('html/pet-gadgets.html');
    loadProducts('pet_gadgets');
}

petFoods.onclick = async () => {
    highlightOption('pet-foods');
    await updateContent('html/pet-foods.html'); 
    loadProducts('pet_foods');
}

// petGadgets.click();

async function updateContent(htmlFilePath) {
    const res = await fetch(htmlFilePath);
    const html = await res.text();
    content.innerHTML = html;
}

function highlightOption(option) {
    const options = [adoptPet, petHouses, petGadgets, petFoods];

    switch (option) {
        case 'adopt-pet':
            options.forEach(optionElement => setupColor('adopt-pet', optionElement));
            break;
        case 'pet-houses':
            options.forEach(optionElement => setupColor('pet-houses', optionElement));
            break;
        case 'pet-gadgets':
            options.forEach(optionElement => setupColor('pet-gadgets', optionElement));
            break;
        case 'pet-foods':
            options.forEach(optionElement => setupColor('pet-foods', optionElement));
            break;
        dafault:
            console.log('Option not found');
    }

    function setupColor(optionID, optionElement) {
        if (!(optionElement.id === optionID)) {
            optionElement.classList.remove('highlighted');
            return;
        }

        if (optionElement.classList.contains('highlighted')) {
            optionElement.classList.remove('highlighted');
            return;
        }

        optionElement.classList.add('highlighted');
    }
}