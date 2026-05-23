import { displayMessage } from './auxiliary.js';

window.history.pushState(null, "", "/adoption-form");

const overlayContainer = document.getElementById('overlay-container');
const selectPetBtn = document.getElementById('select-pet-btn');
const submitApplication = document.getElementById('submit-application');

let pets = [];
let selectedPets = [];

submitApplication.onclick = () => {

    const formData = {
        full_name: getValue('full-name'),
        email_address: getValue('email-address'),   
        phone_number: getValue('phone-number'),
        home_address: getValue('home-address'),
        reason: getValue('reason'),
        existing_pet: getValue('existing-pet'),

        selected_pets: selectedPets.map(p => p.id),

        house_type: document.querySelector('input[name="house"]:checked')?.value ?? "",
        yard_type: document.querySelector('input[name="yard"]:checked')?.value ?? ""
    };

    for (const value of Object.values(formData)) {
        if (value == null || value.toString().trim() === "") {
            displayMessage('Please fill up all fields.');
            return;
        }
    }

    fetch('/submit-adoption-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        if (!data['success']) {
            displayMessage(data['error'], 4000);
            return;
        }
        
        console.log(data)
        window.location.href = '/';
        localStorage.removeItem('form_data');
    });
};

window.addEventListener("load", () => {
    const raw = localStorage.getItem('form_data');
    if (!raw) return;

    const formData = JSON.parse(raw);

    document.getElementById('full-name').value = formData.full_name || "";
    document.getElementById('email-address').value = formData.email_address || "";
    document.getElementById('phone-number').value = formData.phone_number || "";
    document.getElementById('home-address').value = formData.home_address || "";
    document.getElementById('reason').value = formData.reason || "";
    document.getElementById('existing-pet').value = formData.existing_pet || "";

    const house = document.querySelector(`input[name="house"][value="${formData.house_type}"]`);
    if (house) house.checked = true;

    const yard = document.querySelector(`input[name="yard"][value="${formData.yard_type}"]`);
    if (yard) yard.checked = true;

    selectedPets = formData.selected_pets || [];

    renderSelectedPets();
});

window.addEventListener("beforeunload", () => {
    const formData = {
        full_name: getValue('full-name'),
        email_address: getValue('email-address'),
        phone_number: getValue('phone-number'),
        home_address: getValue('home-address'),
        reason: getValue('reason'),
        existing_pet: getValue('existing-pet'),
        selected_pets: selectedPets,
        house_type: document.querySelector('input[name="house"]:checked')?.value ?? null,
        yard_type: document.querySelector('input[name="yard"]:checked')?.value ?? null
    };

    localStorage.setItem("form_data", JSON.stringify(formData));
});

fetch('/get-pets')
    .then(res => res.json())
    .then(data => {
        pets = data.pets;

        selectPetBtn.onclick = async () => {
            await updateContent('html/select-pet.html');

            overlayContainer.style.visibility = 'visible';
            document.body.style.overflowY = 'hidden';

            renderPets();
        };
    });

async function updateContent(path) {
    const res = await fetch(path);
    overlayContainer.innerHTML = await res.text();
}

const getValue = (id) => document.getElementById(id)?.value ?? "";

function getAvailablePets() {
    return pets.filter(pet => !selectedPets.some(sel => sel.id === pet.id)
    );
}

function renderPets() {
    const selectPetUI = document.getElementById('select-pet-ui');
    if (!selectPetUI) return;

    selectPetUI.innerHTML = "";

    getAvailablePets().forEach(pet => {
        const petCard = document.createElement('div');
        petCard.classList.add('card');

        petCard.innerHTML = `
            <div class="pet-image" style="background-image: url('${pet.image}')"></div>
            <div class="pet-details">
                <span class="pet-name">${pet.pet_name}</span>
                <span class="pet-age">${pet.pet_age}</span>
                <span class="pet-description">${pet.pet_description}</span>
            </div>
        `;

        petCard.onclick = () => {
            selectedPets.push(pet);
            renderSelectedPets();
            renderPets();

            overlayContainer.style.visibility = 'hidden';
            document.body.style.overflowY = 'visible';
        };

        selectPetUI.appendChild(petCard);
    });
}

function renderSelectedPets() {
    const container = document.getElementById('selected-pets');

    container.innerHTML = "";

    if (selectedPets.length === 0) {
        container.innerHTML =
            '<span class="placeholder">Selected pet displays here</span>';
        return;
    }

    selectedPets.forEach(pet => {
        const row = document.createElement('div');
        row.classList.add('pet-row');

        row.innerHTML = `
            <span>${pet.pet_name}</span>
            <span>${pet.pet_age}</span>
            <span>${pet.pet_type}</span>
        `;

        row.onclick = () => {
            selectedPets = selectedPets.filter(p => p.id !== pet.id);
            renderSelectedPets();
            renderPets();
        };

        container.appendChild(row);
    });
}