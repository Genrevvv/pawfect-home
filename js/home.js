import { updateContent } from "./auxiliary.js";
import { navBarAnimation } from "./animations.js";
import { featuredScript } from "./featured.js";
import { loadPets } from "./load-pets.js";
import { loadProducts } from "./load-products.js";
import { logIn } from "./header-bar.js";

window.history.pushState(null, "", "/");

const content = document.getElementById('content');

const adoptPet = document.getElementById('adopt-pet');
const petHouses = document.getElementById('pet-houses');
const petGadgets = document.getElementById('pet-gadgets');
const petFoods = document.getElementById('pet-foods');

const homepageRedirectNav = sessionStorage.getItem('homepage-redirect-nav');
if (homepageRedirectNav === null) {
    await updateContent('html/featured.html', content);
    featuredScript();
}

navBarAnimation();

adoptPet.onclick = async () => {
    highlightOption('adopt-pet');
    await updateContent('html/adopt-pet.html', content);
    loadPets();

    document.getElementById('adopt-pet-btn').onclick = () => {
        if (sessionStorage.getItem('username') === null) {
            logIn();
            return;
        }
        
        window.location.href = '/adoption-form';
    }
}

petHouses.onclick = async () => {
    highlightOption('pet-houses');
    await updateContent('html/pet-houses.html', content);
    loadProducts('pet_houses');
}

petGadgets.onclick = async () => {
    highlightOption('pet-gadgets');
    await updateContent('html/pet-gadgets.html', content);
    loadProducts('pet_gadgets');
}

petFoods.onclick = async () => {
    highlightOption('pet-foods');
    await updateContent('html/pet-foods.html', content); 
    loadProducts('pet_foods');
}

if (homepageRedirectNav === 'adopt-a-pet') {
    adoptPet.click();
    sessionStorage.removeItem('homepage-redirect-nav');
}
else if (homepageRedirectNav === 'pet-houses') {
    petHouses.click();
    sessionStorage.removeItem('homepage-redirect-nav');
}
else if (homepageRedirectNav === 'pet-gadgets') {
    petGadgets.click();
    sessionStorage.removeItem('homepage-redirect-nav');
}
else if (homepageRedirectNav === 'pet-foods') {
    petFoods.click();
    sessionStorage.removeItem('homepage-redirect-nav');
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