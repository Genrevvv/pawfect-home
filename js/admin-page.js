import { adoptionManagementScript } from "./adoption-management.js";
import { petManagementScript } from "./pet-management.js";
import { productManagementScript } from "./product-management.js";

window.history.pushState(null, "", "/admin-page");

const container = document.getElementById('container');

const dashboard = document.getElementById('dashboard');
const products = document.getElementById('products');
const pets = document.getElementById('pets');
const adoptions = document.getElementById('adoptions');

dashboard.onclick = async () => {
    highlightOption('dashboard');
    updateContent('html/dashboard.html');
}

products.onclick = async () => {
    highlightOption('products');
    await updateContent('html/product-management.html');
    productManagementScript();
}

pets.onclick = async () => {
    highlightOption('pets');
    await updateContent('html/pet-management.html');
    petManagementScript();
}

adoptions.onclick = async () => {
    highlightOption('adoptions');
    await updateContent('html/adoption-management.html');
    adoptionManagementScript();
}

pets.click();

async function updateContent(htmlFilePath) {
    const res = await fetch(htmlFilePath);
    const html = await res.text();
    container.innerHTML = html;
}

function highlightOption(option) {
    const options = [dashboard, products, pets, adoptions];

    switch (option) {
        case 'dashboard':
            options.forEach(optionElement => setupColor('dashboard', optionElement));
            break;
        case 'products':
            options.forEach(optionElement => setupColor('products', optionElement));
            break;
        case 'pets':
            options.forEach(optionElement => setupColor('pets', optionElement));
            break;
        case 'adoptions':
            options.forEach(optionElement => setupColor('adoptions', optionElement));
            break;
        dafault:
            console.log('Option not found');
    }

    function setupColor(optionID, optionElement) {
        if (!(optionElement.id === optionID)) {
            optionElement.classList.remove('highlighted');
            return;
        }

        // if (optionElement.classList.contains('highlighted')) {
        //     optionElement.classList.remove('highlighted');
        //     return;
        // }

        optionElement.classList.add('highlighted');
    }
}
