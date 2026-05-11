window.history.pushState(null, "", "/");

const content = document.getElementById('content');

const adoptPet = document.getElementById('adopt-pet');
const petHouses = document.getElementById('pet-houses');
const petGadgets = document.getElementById('pet-gadgets');
const petFoods = document.getElementById('pet-foods');

adoptPet.onclick = () => {
    highlightOption('adopt-pet');
    updateContent('html/adopt-pet.html');
}

petHouses.onclick = () => {
    highlightOption('pet-houses');
    updateContent('html/pet-houses.html');
}

petGadgets.onclick = () => {
    highlightOption('pet-gadgets');
    updateContent('html/pet-gadgets.html'); 
}

petFoods.onclick = () => {
    highlightOption('pet-foods');
    updateContent('html/pet-foods.html'); 
}

function updateContent(htmlFilePath) {
    fetch(htmlFilePath)
        .then(res => res.text())
        .then(html => {
            content.innerHTML = html;
        });
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

adoptPet.click();
