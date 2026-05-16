window.history.pushState(null, "", "/adoption-form");

const selectPetBtn = document.getElementById('select-pet-btn');
const overlayContainer = document.getElementById('overlay-container');
let pets = [];
let selectedPets = [];

// localStorage.removeItem('form_data');

console.log(localStorage.getItem('form_data'));

window.addEventListener("load", () => {
    const raw = localStorage.getItem('form_data');
    if (!raw) return;

    const formData = JSON.parse(raw);

    document.getElementById('full-name').value = formData.full_name || "";
    document.getElementById('email-address').value = formData.email_address || "";
    document.getElementById('phone-number').value = formData.phone_number || "";
    document.getElementById('home-address').value = formData.home_address || "";

    selectedPets = formData.selected_pets || [];
    selectedPets.forEach(insertSelectedPet);

    document.getElementById('reason').value = formData.reason || "";

    const house = document.querySelector(`input[name="house"][value="${formData.house}"]`);
    if (house) house.checked = true;

    const yard = document.querySelector(`input[name="yard"][value="${formData.yard}"]`);
    if (yard) yard.checked = true;
}); 

window.addEventListener("beforeunload", () => {
    const houseRadio = document.querySelector('input[name="house"]:checked');
    const yardRadio = document.querySelector('input[name="yard"]:checked');

    const getValue = (id) => document.getElementById(id)?.value ?? "";

    const formData = {
        full_name: getValue('full-name'),
        email_address: getValue('email-address'),
        phone_number: getValue('phone-number'),
        home_address: getValue('home-address'),
        reason: getValue('reason'),
        selected_pets: selectedPets,
        house: document.querySelector('input[name="house"]:checked')?.value ?? null,
        yard: document.querySelector('input[name="yard"]:checked')?.value ?? null
    };

    localStorage.setItem("form_data", JSON.stringify(formData));
});

fetch('/get-pets')
    .then(res => res.json())
    .then(data => {
        console.log(data);

        pets = data['pets'];

        selectPetBtn.onclick = async () => {
            await updateContent('html/select-pet.html');

            overlayContainer.style.visibility = 'visible';
            document.body.style.overflowY = 'hidden';

            for (let i = 0; i < pets.length; i++) {
                console.log(pets[i]['pet_type']);
                addPetCard(pets[i]);
            }
        }

    });

async function updateContent(htmlFilePath) {
    const res = await fetch(htmlFilePath);
    const html = await res.text();
    overlayContainer.innerHTML = html;
}

function addPetCard(petData) {
    const selectPetUI = document.getElementById('select-pet-ui');

    const petCard = document.createElement('div');
    petCard.classList.add('card');
    petCard.innerHTML = `<div class="pet-image" style="background-image: url('${petData.image}')">
                            </div>
                            <div class="pet-details">
                            <span class="pet-name">${petData['pet_name']}</span>
                            <span class="pet-age">${petData['pet_age']}</span>
                            <span class="pet-description">${petData['pet_description']}</span>
                            </div>`;
    selectPetUI.append(petCard);

    petCard.onclick = () => {
        pets = pets.filter(pet => pet.id !== petData['id']);
        selectedPets.push(petData);

        insertSelectedPet(petData);
        
        overlayContainer.style.visibility = 'hidden';
        document.body.style.overflowY = 'visible';
    }
}

function insertSelectedPet(petData) {
    const selectedPetsContainer = document.getElementById('selected-pets');
    const placeHolder = selectedPetsContainer.querySelector('.placeholder');
    if (placeHolder) {
        placeHolder.remove();
    }
    
    const petRow = document.createElement('div');
    petRow.classList.add('pet-row');
    petRow.innerHTML = `<span>${petData['pet_name']}</span>
                        <span>${petData['pet_age']}</span>
                        <span>${petData['pet_type']}</span>
                        <span>${petData['pet_age']}</span>`;

    selectedPetsContainer.append(petRow);

    petRow.onclick = () => {
        petRow.remove();

        selectedPets = selectedPets.filter(pet => pet.id !== petData['id']);
        pets.push(petData);

        if (selectedPets.length === 0) {
            selectedPetsContainer.innerHTML = '<span class="placeholder">Selected pet displays here</span>';
        }
    }
}