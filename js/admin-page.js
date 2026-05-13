import { productManagementScript } from "./product-management.js";

window.history.pushState(null, "", "/admin-page");

const container = document.getElementById('container');

const dashboard = document.getElementById('dashboard');
const products = document.getElementById('products');
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

adoptions.onclick = async () => {
    highlightOption('adoptions');
    updateContent('html/adoption-management.html');
}

async function updateContent(htmlFilePath) {
    const res = await fetch(htmlFilePath);
    const html = await res.text();
    container.innerHTML = html;
}

function highlightOption(option) {
    const options = [dashboard, products, adoptions];

    switch (option) {
        case 'dashboard':
            options.forEach(optionElement => setupColor('dashboard', optionElement));
            break;
        case 'products':
            options.forEach(optionElement => setupColor('products', optionElement));
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

products.click();