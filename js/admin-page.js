window.history.pushState(null, "", "/admin-page");

const container = document.getElementById('container');

const dashboard = document.getElementById('dashboard');
const products = document.getElementById('products');
const adoptions = document.getElementById('adoptions');

dashboard.onclick = () => {
    highlightOption('dashboard');
    updateContent('html/dashboard.html');
}

products.onclick = () => {
    highlightOption('products');
    updateContent('html/product-management.html');
}

adoptions.onclick = () => {
    highlightOption('adoptions');
    updateContent('html/adoption-management.html');
}

function updateContent(htmlFilePath) {
    fetch(htmlFilePath)
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;
        });
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

dashboard.click();