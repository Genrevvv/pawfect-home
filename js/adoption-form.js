window.history.pushState(null, "", "/adoption-form");

const selectPetBtn = document.getElementById('select-pet-btn');
const overlayContainer = document.getElementById('overlay-container');
let pets = [];
let selectedPets = [];

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
    });

async function updateContent(htmlFilePath) {
    const res = await fetch(htmlFilePath);
    const html = await res.text();
    overlayContainer.innerHTML = html;
}